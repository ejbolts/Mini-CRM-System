/*
this file contains the GraphQL queries and mutations provide the necessary functionality to interact with the server
and perform operations related to cards and form data.

*/

export const CREATE_CARD = `
mutation CreateCard($id: ID!, $title: String!, $amount: Int!, $date: String!, $Presentation_Status: String!, $Column_id: Int!, $Presentation_Id: String!, $description: String, $product_Name: String, $product_Image_URL: String, $signature_URL: String, $intro: String) {
  createCard(id: $id, title: $title, amount: $amount, date: $date, Presentation_Status: $Presentation_Status, Column_id: $Column_id, Presentation_Id: $Presentation_Id, description: $description, product_Name: $product_Name, product_Image_URL: $product_Image_URL, signature_URL: $signature_URL, intro: $intro) {
    id
    title
    amount
    date
    Presentation_Status
    Column_id
    Presentation_Id
    description
    product_Name
    product_Image_URL
    signature_URL
    intro
  }
}
`;

export const UPDATE_CARD = `
  mutation UpdateCard($id: ID!, $title: String!, $amount: Int!, $date: String!, $Presentation_Status: String!, $Presentation_Id: String!, $description: String, $product_Name: String, $product_Image_URL: String, $signature_URL: String, $intro: String) {
    updateCard(id: $id, title: $title, amount: $amount, date: $date, Presentation_Status: $Presentation_Status, Presentation_Id: $Presentation_Id, description: $description, product_Name: $product_Name, product_Image_URL: $product_Image_URL, signature_URL: $signature_URL, intro: $intro) {
      id
      title
      amount
      date
      Presentation_Status
      Presentation_Id
      description
      product_Name
      product_Image_URL
      signature_URL
      intro
    }
  }
  `;

export const CREATE_CARD_SUBSECTION = `
mutation CreateCardSubSection($text: String, $status: String, $Item_Id: ID!) {
  createCardSubSection(text: $text, status: $status, Item_Id: $Item_Id) {
    text
    status
    Item_Id
  }
}
`;

export const GET_CARDS = `
query {
  getCards {
    id
    title
    amount
    date
    Presentation_Status
    Column_id
    Presentation_Id
    description
    product_Name
    product_Image_URL
    signature_URL
    intro
  }
}
`;

export const GET_CARDS_SUBSECTIONS = `
query {
  getCardSubSections {
    text
    status
    Item_Id
  }
}
`;

export const DELETE_CARD = `
mutation deleteCard($Item_Id: ID!) {
  deleteCard(id: $Item_Id)
}
`;
export const UPDATE_SUBVALUES = `
mutation updateSubvalues($Item_Id: ID!, $text: String, $status: String) {
  updateSubvalues(Item_Id: $Item_Id, text: $text, status: $status) {
    text
    status
    Item_Id
  }
}`;

export const UPDATE_CARD_POSITION = `
mutation updateCardPosition($id: ID!, $Column_id: Int!) {
  updateCardPosition(id: $id, Column_id: $Column_id) {
    id
    Column_id
  }
}`;

export const UPDATE_CARD_PRESENTATION = `
mutation updateCardPresentation($id: ID!, $Presentation_Status: String!, $Presentation_Id: String!) {
  updateCardPresentation(id: $id, Presentation_Status: $Presentation_Status, Presentation_Id: $Presentation_Id) {
    id
    Presentation_Status
    Presentation_Id
  }
}`;

export const GET_CARD_PRESENTATION = `
query getCardPresentation($id: ID!, $Presentation_Id: String!) {
  getCardPresentation(id: $id, Presentation_Id: $Presentation_Id) {
    id
    Presentation_Id
  }
}`;

export const CREATE_FORM_DATA = `
  mutation createFormData(
    $first_Name: String,
    $last_Name: String,
    $contact_ID: Int!,
    $email: String,
    $phone_Number: String,
    $role: String,
    $client_Name: String,
    $Item_Id: String
  ) {
    createFormData(
      first_Name: $first_Name, 
      last_Name: $last_Name,
      contact_ID: $contact_ID,
      email: $email,
      phone_Number: $phone_Number,
      role: $role,
      client_Name: $client_Name,
      Item_Id: $Item_Id
    ) {
      first_Name
      last_Name
      contact_ID
      email
      phone_Number
      role
      client_Name
      Item_Id
    }
  }
`;

export const UPDATE_FORM_DATA = `
mutation updateFormData(
  $first_Name: String,
  $last_Name: String,
  $email: String,
  $phone_Number: String,
  $role: String,
  $Item_Id: String,
  $client_Name: String
) {
  updateFormData(
    first_Name: $first_Name, 
    last_Name: $last_Name,
    email: $email,
    phone_Number: $phone_Number,
    role: $role,
    Item_Id: $Item_Id
    client_Name: $client_Name
  ) {
    first_Name
    last_Name
    email
    phone_Number
    role
    Item_Id
    client_Name
  }
}
`;

export const GET_FORM_DATA = `
  query {
    getFormData  {
      first_Name
      last_Name
      contact_ID
      email
      phone_Number
      role
      Item_Id
      client_Name
    }
  }
`;
