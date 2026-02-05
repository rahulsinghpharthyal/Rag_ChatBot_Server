import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || ""
export const NODE_ENV = process.env.NODE_ENV || ""
export const RZP_KEY_ID = process.env.RAZORPAY_KEY_ID || ""
export const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ""

export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASS = process.env.SMTP_PASS

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
export const JWT_ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_TOKEN_EXPIRES
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
export const JWT_REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_TOKEN_EXPIRES


export const GROQ_API_KEY = process.env.GROQ_API_KEY
export const DEBUG = process.env.DEBUG
export const TAVILY_API_KEY = process.env.TAVILY_API_KEY
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY