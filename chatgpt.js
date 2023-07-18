import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import dotenv from "dotenv";

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const myOpenAi = new OpenAIApi(configuration);

export const getOpenAIResponse = async (inputMessage) => {
  const chatGptMessages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: inputMessage,
    },
  ];

  const res = await myOpenAi.createChatCompletion({
    messages: chatGptMessages,
    model: "gpt-3.5-turbo",
  });
  return res.data.choices[0].message?.content;
};
