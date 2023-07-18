/*
this file consists of a collection of functions that facilitate interaction with a GraphQL server. 
These functions handle various operations related to creating, updating, and retrieving data for cards and their subsections.

The functions handle both successful responses and errors. In case of success, the response data is parsed and returned. 
However, if an error occurs during the request or response processing, appropriate error messages are logged to the console.

Additionally, there is a generic function called sendGraphQLRequest that can be used to send custom GraphQL queries or mutations
by providing the query and variables as parameters. This function follows a similar pattern to the other functions in handling requests and errors.

Overall, this file provides a set of utility functions that enable convenient interaction with a GraphQL server for managing card
and subsection data.

*/

export async function deleteCardData(DELETE_CARD, variables) {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: DELETE_CARD,
        variables,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting card/subsections:", error);
  }
}

export function updateSubvaluesData(updatedSubsections, UPDATE_SUBVALUES) {
  const createUpdatedSubSectionPromises = updatedSubsections.map(
    (subSection) => {
      console.log("subSection:", subSection);
      return fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: UPDATE_SUBVALUES,
          variables: {
            text: subSection.text,
            status: subSection.status,
            Item_Id: subSection.cardId,
          },
        }),
      });
    }
  );

  Promise.all(createUpdatedSubSectionPromises)
    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()));
    })

    .catch((error) => {
      console.error("Error updating subsections:", error);
    });
}

export async function handleCreateCardSubSection(
  subSectionsArray,
  CREATE_CARD_SUBSECTION
) {
  const createSubSectionPromises = subSectionsArray.map((subSection) => {
    return fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CREATE_CARD_SUBSECTION,
        variables: {
          text: subSection.text,
          status: subSection.status,
          Item_Id: subSection.cardId,
        },
      }),
    });
  });

  return Promise.all(createSubSectionPromises)
    .then((responses) => {
      return Promise.all(responses.map((response) => response.json()));
    })
    .catch((error) => {
      console.error("Error creating subsection:", error);
    });
}

export async function updateCardsPositionData(UPDATE_CARD_POSITION, variables) {
  try {
    console.log("variables:", variables);
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: UPDATE_CARD_POSITION,
        variables,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting card/subsections:", error);
  }
}

export async function getCardsData(GET_CARDS) {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: GET_CARDS,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error Getting cards:", error);
  }
}

export async function getPresentationData(GET_CARD_PRESENTATION) {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: GET_CARD_PRESENTATION,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error Getting cards:", error);
  }
}

export async function getCardsSubSectionData(GET_CARDS_SUBSECTIONS) {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: GET_CARDS_SUBSECTIONS,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error Getting cardsSubsections:", error);
  }
}

export async function handleCreateCard(Card, CREATE_CARD) {
  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: CREATE_CARD,
      variables: {
        id: Card.id,
        title: Card.title,
        amount: Card.amount,
        date: Card.date,
        Presentation_Status: Card.presentationStatus,
        Column_id: Card.columnId,
        Presentation_Id: Card.presentationId,
      },
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error creating card:", error);
    });
}

export async function handleCreateFormData(CREATE_FORM_DATA, variables) {
  try {
    console.log("variables:", variables);
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: CREATE_FORM_DATA,
        variables,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting card/subsections:", error);
  }
}

export const sendGraphQLRequest = async (query, variables) => {
  console.log("variables:", variables);

  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.statusText}`);
  }

  const jsonResponse = await response.json();

  if (jsonResponse.errors) {
    throw new Error(`GraphQL error: ${jsonResponse.errors[0].message}`);
  }

  return jsonResponse.data;
};

export async function updateCardPresentationData(
  UPDATE_CARD_PRESENTATION,
  variables
) {
  try {
    console.log("variables:", variables);
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query: UPDATE_CARD_PRESENTATION,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating card presentation: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating card presentation:", error);
  }
}
