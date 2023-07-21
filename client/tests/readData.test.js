import fetchMock from "fetch-mock";
import { getCardsData, getCardsSubSectionData } from "../serverRequests";
import { GET_CARDS, GET_CARDS_SUBSECTIONS } from "../queryConsts";

test("getCardsData fetches cards correctly", async () => {
  // Arrange
  const mockResponse = {
    data: {
      getCards: [
        {
          id: "1",
          title: "Card 1",
          amount: 11000,
          Column_id: "2",
        },
        {
          id: "2",
          title: "Card 2",
          amount: 22000,
          Column_id: "1",
        },
      ],
    },
  };

  fetchMock.post("https://mini-crm-system.vercel.app/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  const result = await getCardsData(GET_CARDS);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);

  expect(requestBody.query).toBe(GET_CARDS);
  expect(result).toEqual(mockResponse.data);

  fetchMock.restore();
});

test("getCardsSubSectionData fetches cards sub-section data correctly", async () => {
  // Arrange

  const mockResponse = {
    data: {
      cardsSubSections: [
        { id: "1", text: "Personal Info", status: "Done" },
        { id: "2", text: "Background", status: "InProgress" },
      ],
    },
  };

  fetchMock.post("https://mini-crm-system.vercel.app/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  const result = await getCardsSubSectionData(GET_CARDS_SUBSECTIONS);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);

  expect(requestBody.query).toBe(GET_CARDS_SUBSECTIONS);
  expect(result).toEqual(mockResponse.data);

  fetchMock.restore();
});
