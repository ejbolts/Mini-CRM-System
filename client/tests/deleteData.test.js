import fetchMock from "fetch-mock";
import { deleteCardData } from "../serverRequests";
import { DELETE_CARD } from "../queryConsts";

test("deleteCardData deletes the card correctly", async () => {
  // Arrange

  const mockResponse = {
    data: {
      deleteCard: true,
    },
  };

  const variables = {
    Item_Id: "1",
  };

  fetchMock.post("https://mini-crm-system.vercel.app/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  const result = await deleteCardData(DELETE_CARD, variables);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);

  expect(requestBody.query).toBe(DELETE_CARD);
  expect(requestBody.variables).toEqual(variables);
  expect(result).toEqual(mockResponse.data);

  fetchMock.restore();
});
