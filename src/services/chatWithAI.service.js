import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
import groq from "../ai/groqClient.js";
import { TAVILY_API_KEY } from "../config/env.js";

// const groq = new Groq({ apiKey: GROQ_API_KEY });
const tvly = tavily({ apiKey: TAVILY_API_KEY });

// we are implement the node-cache to make the memory we can save the messages into the DB also for liffetime history:-


const cache = new NodeCache({stdTTL: 60*60*24}); // 24 hours



export const chatWithAIService = async (userMessage, userId) => {
  const baseMessages = [
    {
      // in the system promting its optional to tell
      role: "system",
      content: `
                You are a smart AI personal assistant. 
                You must always be helpful, concise, and accurate. 
                If you don’t know something, or if the question requires real-time or up-to-date information, 
                you MUST call the "searchWeb" tool with a clear query.

                Current date and time: ${new Date().toString()}

                You have access to the following tool:
                1. webSearch({query: string}) 
                  → Searches the internet for the latest information and real-time data.

                ### Examples (Few-shot prompting):

                User: "Who won the 2024 UEFA Champions League?"
                Assistant Thinking: "This requires up-to-date info."
                Assistant Action: webSearch({ "query": "2024 UEFA Champions League winner" })

                ---

                User: "What is the capital of France?"
                Assistant Thinking: "This is general knowledge, no tool required."
                Assistant Answer: "The capital of France is Paris."

                ---

                User: "What's the weather like in Mumbai today?"
                Assistant Thinking: "This needs real-time weather info."
                Assistant Action: webSearch({ "query": "current weather in Mumbai" })

                ---

                User: "Explain what machine learning is."
                Assistant Thinking: "This is a general knowledge question."
                Assistant Answer: "Machine learning is a field of AI that allows systems to learn patterns from data and make predictions without being explicitly programmed."

                ---

                ### Rules:
                - ALWAYS provide the best possible answer.
                - If the question needs real-time data → use searchWeb.
                - If the question is common knowledge → answer directly.
                - Be polite, professional, and easy to understand.
                `,
    },
    // {
    //   role: "user",
    //   content: `HI`,
    //   // `What is the current weather in mumbai?`,
    //   // `When was iphone 16 launched?`,
    // },
  ];

  const messages = cache.get(userId) ?? baseMessages;

  messages.push({
    role: "user",
    content: userMessage,
  });
  // for tool calling this lopp used:-
  // preveting the infinite loop under the tool calling:-
  const MAX_RETRIES = 10;
  let count = 0;
  while (true) {
    if(count > MAX_RETRIES) {
       return "I Could not find the result, Please try again";
    };
    count++;
    const completion = await groq.chat.completions.create({
      temperature: 0,
      model: "llama-3.3-70b-versatile",
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and real time data on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The Search query to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      //optional:-
      tool_choice: "auto",
    });

    //First completion result push to the messages:-
    messages.push(completion.choices[0].message);

    if (completion?.choices[0]?.message?.tool_calls) {
      for (const tool of completion.choices[0].message.tool_calls) {
        // console.log("tool: ", tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;
        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
          // console.log("Tool Result: ", toolResult);

          messages.push({
            tool_call_id: tool?.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    } else {
      //Here we end the chat bot ans:-
      cache.set(userId, messages);
      // console.log('this is cache', cache)
      // console.log("Assistent:", completion?.choices[0]?.message?.content);
      return completion?.choices[0]?.message?.content;
    }
  }
};

async function webSearch({ query }) {
  // Here we will do tavily api call
  console.log("calling webSerach--------");
  const response = await tvly.search(query);
  // console.log('This is Tavily repsonse after web Search---->', response)
  const finalResult = response?.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}
