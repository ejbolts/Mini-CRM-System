import fetchMock from "fetch-mock";
import {
  updateSubvaluesData,
  updateCardsPositionData,
} from "../serverRequests";
import { UPDATE_SUBVALUES, UPDATE_CARD_POSITION } from "../queryConsts";

test("updateSubvaluesData updates sub-section data correctly", async () => {
  // Arrange
  const updatedSubsections = [
    { text: "Personal Info", status: "Done", cardId: 12345 },
    { text: "Background", status: "InProgress", cardId: 54321 },
  ];

  const mockResponse = {
    data: {
      updateSubvalues: {
        text: "Personal Info",
        status: "Done",
        Item_Id: 12345,
      },
    },
  };

  fetchMock.post("https://mini-crm-system.vercel.app/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  await updateSubvaluesData(updatedSubsections, UPDATE_SUBVALUES);

  // Assert
  expect(fetchMock.calls().length).toBe(updatedSubsections.length);

  updatedSubsections.forEach((subSection, index) => {
    const { body } = fetchMock.calls()[index][1];
    const requestBody = JSON.parse(body);

    expect(requestBody.query).toBe(UPDATE_SUBVALUES);
    expect(requestBody.variables).toEqual({
      text: subSection.text,
      status: subSection.status,
      Item_Id: subSection.cardId,
    });
  });
  fetchMock.restore();
});

test("updateCardsPositionData updates cards position correctly", async () => {
  // Arrange
  const mockResponse = {
    data: {
      updateCardPosition: {
        id: "1",
        Column_id: 2,
      },
    },
  };

  const variables = {
    id: "1",
    Column_id: 2,
  };

  fetchMock.post("https://mini-crm-system.vercel.app/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  const result = await updateCardsPositionData(UPDATE_CARD_POSITION, variables);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);

  expect(requestBody.query).toBe(UPDATE_CARD_POSITION);
  expect(requestBody.variables).toEqual(variables);
  expect(result).toEqual(mockResponse.data);

  fetchMock.restore();
});
