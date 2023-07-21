import { Configuration, OpenAIApi } from "openai";



export const generateImage = async (productName, openai_key) => {

  const configuration = new Configuration({
    apiKey: openai_key,
  });
  const myOpenAi = new OpenAIApi(configuration);
  const response = await myOpenAi.createImage({
    prompt: `${productName}`,
    n: 1,
    size: "512x512",
  });
  return response.data.data[0].url;
};
