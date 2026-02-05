import { chatWithRagService } from "../services/chatWithRag.service.js";
import { ApiError } from "../utils/ApiError.js";

export const chatWithRag = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("this is message form ", req.body);
    if (!message) throw new ApiError(400, "Please Enter the message....");
    // return res.status(400).json({message: "Please Enter the message..."});
    const finalResult = await chatWithRagService(message);
    return res.status(200).json({ message: finalResult });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Server error......");
  }
};
