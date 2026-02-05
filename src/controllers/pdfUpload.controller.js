import fs from "fs";
import path from "path";
import { ApiError } from "../utils/ApiError.js";
import { indexTheDocument } from "../services/indexDocument.service.js";

export const uploadAndIndexPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // Save PDF temporarily
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(filePath, req.file.buffer);

    console.log('thisis file path', filePath)
    // Index document
    await indexTheDocument(filePath);

    return res.status(200).json({
      success: true,
      message: "PDF uploaded and indexed successfully",
      fileName: req.file.originalname,
    });

  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Failed to index PDF")
  }
};
