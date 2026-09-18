import openAI from "openai";
 import dotenv from "dotenv";
 dotenv.config();

 

const openai=new openAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;