import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const myOpenAi = new OpenAIApi(configuration);

export const generateImage = async (productName) => {
  const response = await myOpenAi.createImage({
    prompt: `${productName}`,
    n: 1,
    size: "512x512",
  });
  return response.data.data[0].url;
};
