import { chatWithAIService } from "../services/chatWithAI.service.js";
import { ApiError } from "../utils/ApiError.js";

export const chatWithAI = async (req, res) => {
  try {
    console.log(req.body)
    const {message, userId} = req.body;
     if(!message || !userId)
        throw new ApiError(400, "Please Enter the message...")
    const finalResult = await chatWithAIService(message, userId);
    return res.status(200).json({message: finalResult})
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "Server Error....")
  }
};
