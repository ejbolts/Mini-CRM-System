import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";



export const getOpenAIResponse = async (inputMessage, openai_key) => {
  console.log("openai_key", openai_key)
  const configuration = new Configuration({
    apiKey: openai_key,
  });
  const myOpenAi = new OpenAIApi(configuration);
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
