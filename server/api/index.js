import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import mysql from "mysql2";
import cors from "cors";
import {
  initialPresentationCreation,
  updatePresentation,
} from "./googlePresentation.js";
import { OAuth2Client } from "google-auth-library";
import * as chatgptfile from "./chatgpt.js";
import * as DALL_Efile from "./DALL-E.js";
/*
This file is responsible for creating the GraphQL server and defining the schema and resolvers and receiving requests from the endpoints.
*/

const app = express();
app.use(
  cors({
    origin: "https://mini-crm-system-k4ex.vercel.app/",
    credentials: true,
  }),
  express.json()
);

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "cool-sql-password",
  database: "dockersql",
  connectionLimit: 20,
});

const schema = buildSchema(`
type Mutation {
  createFormData(
    first_Name: String, 
    last_Name: String, 
    contact_ID: Int!,
    email: String,
    phone_Number: String,
    role: String,
    client_Name: String,
    Item_Id: String
  ): FormData

  createCard(
    id: ID!,
    title: String!,
    amount: Int!,
    date: String!,
    Column_id: Int!,
    Presentation_Status: String!, 
    Presentation_Id: String!,
    description: String,
    product_Name: String,
    product_Image_URL: String,
    signature_URL: String
    intro: String
  ): Card

  updateCard(
    id: ID!,
    title: String!,
    amount: Int!,
    date: String!,
    Presentation_Status: String!, 
    Presentation_Id: String!,
    description: String,
    product_Name: String,
    product_Image_URL: String,
    signature_URL: String
    intro: String
  ): Card

  updateFormData(
    first_Name: String,
    last_Name: String,
    email: String,
    phone_Number: String,
    role: String,
    Item_Id: String,
    client_Name: String
  ) : FormData

  

  createCardSubSection(
    text: String,
    status: String,
    Item_Id: ID!
  ) : CardSubSection

  updateSubvalues(
    text: String,
    status: String,
    Item_Id: ID!
  ) : CardSubSection

  updateCardPosition(
    id: ID!,
    Column_id: Int!
  ) : Card

  updateCardPresentation(
    id: ID!,
    Presentation_Status: String!
    Presentation_Id: String!
  ) : Card
  createCardPresentation(
    id: ID!,
    Presentation_Id: String!
  ) : Card

  deleteCard(
    id: ID!
  ) : ID
}

type FormData {
  first_Name: String
  last_Name: String
  contact_ID: Int
  email: String
  phone_Number: String
  role: String
  Item_Id: String
  client_Name: String
}

type Card {
  id: ID!
  title: String!
  amount: Int!
  date: String!
  Column_id: Int!
  Presentation_Status: String!
  Presentation_Id: String!
  description: String
  product_Name: String
  product_Image_URL: String
  signature_URL: String
  intro: String
}


type CardSubSection {
  text: String
  status: String
  Item_Id: ID
}
type Query {
  getFormData: [FormData]  
  getCards: [Card]
  getCardSubSections: [CardSubSection]
  getCardPresentation: [Card]
}

`);

const queryDB = (sql, args) => {
  return new Promise((resolve, reject) => {
    console.log("Executing query:", sql, "with args:", args);
    pool.query(sql, args, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const root = {
  deleteCard: async (args, req) => {
    try {
      await queryDB("DELETE FROM Items WHERE Id=?", args.id);
      return args.id;
    } catch (error) {
      return console.error("Error deleting card/subsections:", error);
    }
  },

  getCards: (args, req) => {
    return queryDB("SELECT * FROM Items").then((data) => {
      return data.map((item) => ({
        id: item.Id,
        title: item.Title,
        amount: item.Amount,
        date: item.Close_Date,
        Column_id: item.Column_id,
        Presentation_Status: item.Presentation_Status,
        Presentation_Id: item.Presentation_Id,
        description: item.Description,
        product_Name: item.Product_Name,
        product_Image_URL: item.Product_Image_URL,
        signature_URL: item.Signature_URL,
        intro: item.Intro,
      }));
    });
  },

  getFormData: (args, req) => {
    return queryDB("SELECT * FROM Contacts").then((data) => {
      return data.map((item) => ({
        first_Name: item.First_Name,
        last_Name: item.Last_Name,
        contact_ID: item.Contact_ID,
        email: item.Email,
        phone_Number: item.Phone_Number,
        role: item.Role,
        client_Name: item.Client_Name,
        Item_Id: item.Item_Id,
      }));
    });
  },

  getCardPresentation: (args, req) => {
    const { Presentation_Id, id } = args;
    queryDB("SELECT * FROM Items WHERE Presentation_Id=? AND Id=?", [
      Presentation_Id,
      id,
    ]);
    return {
      Presentation_Id,
      id,
    };
  },

  getCardSubSections: (args, req) => {
    return queryDB("SELECT * FROM Item_Subsections").then((data) => {
      return data.map((item) => ({
        text: item.Text,
        status: item.Status,
        Item_Id: item.Item_Id,
      }));
    });
  },
  createCardSubSection: async (args, req) => {
    const { Text, Status, Item_Id } = args;

    try {
      await queryDB("INSERT INTO Item_Subsections SET ?", args);

      return {
        Text,
        Status,
        Item_Id,
      };
    } catch (error) {
      console.error("Error while inserting cardSubsection:", error);
      throw error;
    }
  },

  updateSubvalues: async (args, req) => {
    const { text, status, Item_Id } = args;

    try {
      await queryDB(
        "UPDATE Item_Subsections SET Status=? WHERE Item_Id=? AND Text=?",
        [status, Item_Id, text]
      );

      return {
        text,
        status,
        Item_Id,
      };
    } catch (error) {
      console.error("Error while updating cardSubsection:", error);
      throw error;
    }
  },

  updateCardPosition: async (args, req) => {
    const { Column_id, id } = args;

    try {
      await queryDB("UPDATE Items SET Column_id=? WHERE id=?", [Column_id, id]);

      return {
        Column_id,
        id,
      };
    } catch (error) {
      console.error("Error while updating cards position:", error);
      throw error;
    }
  },

  updateCardPresentation: async (args, req) => {
    const { Presentation_Status, id, Presentation_Id } = args;

    try {
      const result = await queryDB(
        "UPDATE Items SET Presentation_Status=?, Presentation_Id=? WHERE id=?",
        [Presentation_Status, Presentation_Id, id]
      );

      return {
        Presentation_Status,
        id,
        Presentation_Id,
      };
    } catch (error) {
      console.error("Error while creating cards presentation:", error);
      throw error;
    }
  },

  createCard: async (args, req) => {
    const {
      id,
      title,
      amount,
      date,
      Column_id,
      Presentation_Status,
      Presentation_Id,
      description,
      product_Name,
      product_Image_URL,
      signature_URL,
      intro,
    } = args;

    try {
      await queryDB(
        "INSERT INTO Items (Title, Amount, Close_Date, Column_id, Presentation_Status, Presentation_Id, Id, Description, Product_Name, product_Image_URL, Signature_URL, Intro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          amount,
          date,
          Column_id,
          Presentation_Status,
          Presentation_Id,
          id,
          description,
          product_Name,
          product_Image_URL,
          signature_URL,
          intro,
        ]
      );

      return {
        id,
        title,
        amount,
        date,
        Column_id,
        Presentation_Status,
        Presentation_Id,
        description,
        product_Name,
        product_Image_URL,
        signature_URL,
        intro,
      };
    } catch (error) {
      console.error("Error while inserting card:", error);
      throw error;
    }
  },

  updateCard: async (args, req) => {
    const {
      id,
      title,
      amount,
      date,
      Presentation_Status,
      Presentation_Id,
      description,
      product_Name,
      product_Image_URL,
      signature_URL,
      intro,
    } = args;

    try {
      await queryDB(
        "UPDATE Items SET Title=?, Amount=?, Close_Date=?, Presentation_Status=?, Presentation_Id=?, Description=?, Product_Name=?, Product_Image_URL=?, Signature_URL=?, Intro=? WHERE Id=?",
        [
          title,
          amount,
          date,
          Presentation_Status,
          Presentation_Id,
          description,
          product_Name,
          product_Image_URL,
          signature_URL,
          intro,
          id,
        ]
      );

      return {
        id,
        title,
        amount,
        date,
        Presentation_Status,
        Presentation_Id,
        description,
        product_Name,
        product_Image_URL,
        signature_URL,
        intro,
      };
    } catch (error) {
      console.error("Error while updating card:", error);
      throw error;
    }
  },

  createFormData: async (args, req) => {
    const {
      first_Name,
      last_Name,
      contact_ID,
      email,
      phone_Number,
      role,
      client_Name,
      Item_Id,
    } = args;

    // Then proceed with inserting into Contacts
    const contactResult = await queryDB(
      "INSERT INTO Contacts (First_Name, Last_Name, Contact_ID,  Email, Phone_Number, Role, Client_Name, Item_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        first_Name,
        last_Name,
        contact_ID,
        email,
        phone_Number,
        role,
        client_Name,
        Item_Id,
      ]
    );

    if (contactResult.affectedRows === 0) {
      throw new Error("Failed to insert into Contacts");
    }

    // Return the user data
    return {
      first_Name,
      last_Name,
      contact_ID,
      email,
      phone_Number,
      role,
      client_Name,
      Item_Id,
    };
  },

  updateFormData: async (args, req) => {
    const {
      first_Name,
      last_Name,
      email,
      phone_Number,
      role,
      client_Name,
      Item_Id,
    } = args;

    // Update existing contact
    console.log("args:", args);
    const contactResult = await queryDB(
      "UPDATE Contacts SET First_Name = ?, Last_Name = ?, Email = ?, Phone_Number = ?, Role = ?,Client_Name = ? WHERE Item_Id = ?",
      [first_Name, last_Name, email, phone_Number, role, client_Name, Item_Id]
    );

    if (contactResult.affectedRows === 0) {
      throw new Error("Failed to update Contacts");
    }

    // Return the user data
    return {
      first_Name,
      last_Name,
      email,
      phone_Number,
      role,
      client_Name,
      Item_Id,
    };
  },
};

app.use(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.post("/create-and-duplicate-presentation", async (req, res) => {
  console.log("POST request received at /create-and-duplicate-presentation");

  const userEmail = req.body.userEmail;
  const proposalTitle = req.body.proposalTitle;
  const newSubTitle = req.body.newSubTitle;
  const newDescription = req.body.newDescription;
  const newProductName = req.body.newProductName;
  const newProductImageURL = req.body.newProductImageURL;
  const newSignatureURL = req.body.newSignatureURL;
  const newIntro = req.body.newIntro;
  const PRESENTATION_ID = req.body.NewPresentationID;

  try {
    const NewPresentationID = await initialPresentationCreation(
      userEmail,
      proposalTitle,
      newSubTitle,
      newDescription,
      newProductName,
      newProductImageURL,
      newSignatureURL,
      newIntro,
      PRESENTATION_ID
    );
    res.status(200).send({ success: true, NewPresentationID });
  } catch (error) {
    console.error("Error creating presentation:", error);
    res.status(500).send({
      success: false,
      message: `Error creating presentation: ${error.message}`,
    });
  }
});

app.post("/update-presentation", async (req, res) => {
  console.log("POST request received at /update-presentation");
  console.log("req.body:", req.body);

  const presentationId = req.body.presentationId;
  const proposalTitle = req.body.proposalTitle;
  const newSubTitle = req.body.newSubTitle;
  const newDescription = req.body.newDescription;
  const newProductName = req.body.newProductName;
  const newProductImageURL = req.body.newProductImageURL;
  const newSignatureURL = req.body.newSignatureURL;
  const newIntro = req.body.newIntro;

  try {
    await updatePresentation(
      presentationId,
      proposalTitle,
      newSubTitle,
      newDescription,
      newProductName,
      newProductImageURL,
      newSignatureURL,
      newIntro
    );

    res.send({
      success: true,
      message: "Presentation updated successfully",
    });
  } catch (error) {
    console.error("Error creating presentation:", error);
    res.status(500).send({
      success: false,
      message: `Error creating presentation: ${error.message}`,
    });
  }
});

app.post("/verify-login-email", async (req, res) => {
  console.log("POST request received at /verify-login-email");

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const oauthClient = new OAuth2Client(CLIENT_ID);

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    // Verify the JWT token using Google's OAuth2Client
    const ticket = await oauthClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // Get the user's email from the verified JWT payload
    const userEmail = payload.email;
    // Attach the userEmail to the request object for use in subsequent middleware or route handlers
    req.userEmail = userEmail;
    res
      .status(200)
      .json({ message: "Token verified successfully", userEmail: userEmail });

    console.log("Token verified successfully, user email:", userEmail);
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.post("/get-openai-response", async (req, res) => {
  try {

    const inputMessage = req.body.inputMessage;
    const openai_key = req.body.openai_key;
    console.log("openai_key:", openai_key);

    const response = await chatgptfile.getOpenAIResponse(
      `Generate a one paragraph description for a comapny based of this input: ${inputMessage}`, openai_key
    );
    res.json(response);
  } catch (error) {
    console.log(error)
  }
});


app.post("/get-openai-Intro-response", async (req, res) => {
  try {

    const inputMessage = req.body.inputMessage;
    const openai_key = req.body.openai_key;
    const response = await chatgptfile.getOpenAIResponse(
      `Generate a one paragraph Executive Summary for a comapny based of this input description of the comapny: ${inputMessage}`, openai_key
    );
    res.json(response);

  }
  catch (error) {
    console.log(error)
  }
});


app.post("/get-openai-image", async (req, res) => {
  const inputMessage = req.body.inputMessage;
  const openai_key = req.body.openai_key;
  console.log("inputMessage:", inputMessage);
  const response = await DALL_Efile.generateImage(inputMessage, openai_key);
  console.log("response:", response);
  res.json(response);
});

app.listen(4000);
