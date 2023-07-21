import {
  handleCreateCard,
  handleCreateCardSubSection,
} from "../serverRequests.js";
import fetchMock from "fetch-mock";
import { CREATE_CARD_SUBSECTION, CREATE_CARD } from "../queryConsts.js";

beforeEach(() => {
  fetchMock.restore();
});

test("handleCreateCard creates a card correctly", async () => {
  // Arrange
  const Card = {
    id: "123",
    title: "Test Card",
    amount: 15000,
    date: "23-5-2023",
  };

  const mockResponse = {
    data: {
      createCard: {
        id: Card.id,
        title: Card.title,
        amount: Card.amount,
        date: Card.date,
        Column_id: 0,
      },
    },
  };

  fetchMock.post("http://localhost:4000/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  await handleCreateCard(Card, CREATE_CARD);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);
  expect(requestBody.variables).toMatchObject(Card);
  expect(requestBody.query).toBe(CREATE_CARD);
  expect(requestBody.variables).toMatchObject(Card);
});

test("handleCreateCardSubSection creates subSections correctly", async () => {
  // Arrange
  const subSectionsArray = [
    { text: "Personal Info", status: "Done", cardId: 12345 },
    { text: "Background", status: "InProgress", cardId: 54321 },
  ];

  const mockResponse = {
    data: {
      createCardSubSection: {
        text: "Personal Info",
        status: "Done",
        Item_Id: "123abc",
      },
    },
  };

  fetchMock.post("http://localhost:4000/graphql", {
    status: 200,
    body: JSON.stringify(mockResponse),
  });

  // Act
  await handleCreateCardSubSection(subSectionsArray, CREATE_CARD_SUBSECTION);

  // Assert
  const [firstCall] = fetchMock.calls();
  const { body } = firstCall[1];
  const requestBody = JSON.parse(body);

  expect(fetchMock.calls().length).toBe(subSectionsArray.length);

  subSectionsArray.forEach((subSection, index) => {
    const { body } = fetchMock.calls()[index][1];
    const requestBody = JSON.parse(body);

    expect(requestBody.query).toBe(CREATE_CARD_SUBSECTION);
    expect(requestBody.variables).toEqual({
      text: subSection.text,
      status: subSection.status,
      Item_Id: subSection.cardId,
    });
  });
});
