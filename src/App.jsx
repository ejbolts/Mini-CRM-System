import "./index.css";
import Header from "./Header";
import MyList from "./list";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, createContext, useRef } from "react";
import Box from "@mui/material/Box";
import ProposalModal from "./ProposalModal";
import { v4 as uuid } from "uuid";
import GoogleLogo from "../images/google-icon.svg";
import {
  handleCreateCardSubSection,
  handleCreateCard,
  sendGraphQLRequest,
} from "./serverRequests";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  CREATE_CARD,
  CREATE_CARD_SUBSECTION,
  CREATE_FORM_DATA,
} from "./queryConsts";
import dayjs from "dayjs";

/*
Component renders the main page of a proposal management application. 
It contains state variables for managing the columns and cards of the Kanban board, as well as for creating new proposal cards.
It also includes a modal for creating new proposals and a list component for displaying the existing proposals. 
The component also includes Google OAuth authentication for logging in and out of the application.

*/
export const useCustomState = (initialState) => {
  const [state, setState] = useState(initialState);
  const handleStateChange = (event, newState) => {
    if (event) event.stopPropagation();
    setState(newState);
  };

  return [state, handleStateChange];
};
export const AiAssistContext = createContext();
function App() {
  const [aiAssistChecked, setAiAssistChecked] = useState(false);
  const [generateIntro, setGenerateIntro] = useState(false);
  const sigCanvas = useRef();

  const initialColumns = [
    {
      id: 0,
      name: "Solution Pending",
      items: [],
    },
    {
      id: 1,
      name: "Quote Pending",
      items: [],
    },
    {
      id: 2,
      name: "Schedule Pending",
      items: [],
    },
    {
      id: 3,
      name: "Proposal Pending",
      items: [],
    },
    {
      id: 4,
      name: "Proposal Finalised",
      items: [],
    },
  ];
  //card sub-section constants
  const [PersonalInfo, handlePersonalInfo] = useCustomState("");
  const [Background, handleBackground] = useCustomState("");
  const [Approach, handleApproach] = useCustomState("");
  const [Challenges, handleChallenges] = useCustomState("");
  const [Scope, handleScope] = useCustomState("");
  const [Timeline, handleTimeline] = useCustomState("");
  const [Investment, handleInvestment] = useCustomState("");
  const [AboutUs, handleAboutUs] = useCustomState("");
  const [CaseStudies, handleCaseStudies] = useCustomState("");
  const [Support, handleSupport] = useCustomState("");
  const [Terms, handleTerms] = useCustomState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setClientName("");
    setCompanyDESCRIP("");
    setProductName("");
    setProductImageURL("");
    setSignatureURL("");

    setEditMode(false);
    setDate("");
    setOpen(true);
    handlePersonalInfo("");
    handleBackground("");
    handleApproach("");
    handleChallenges("");
    handleScope("");
    handleTimeline("");
    handleInvestment("");
    handleAboutUs("");
    handleCaseStudies("");
    handleSupport("");
    handleTerms("");
  };
  const cardSubSectionData = {
    PersonalInfo,
    Background,
    Approach,
    Challenges,
    Scope,
    Timeline,
    Investment,
    AboutUs,
    CaseStudies,
    Support,
    Terms,
    handlePersonalInfo,
    handleBackground,
    handleApproach,
    handleChallenges,
    handleScope,
    handleTimeline,
    handleInvestment,
    handleAboutUs,
    handleCaseStudies,
    handleSupport,
    handleTerms,
    open,
  };
  //form constants

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [role, setRole] = useState("");
  const [clientName, setClientName] = useState("");
  const [companyDESCRIP, setCompanyDESCRIP] = useState("");
  const [productName, setProductName] = useState("");
  const [productImageURL, setProductImageURL] = useState("");
  const [signatureURL, setSignatureURL] = useState("");
  const [intro, setIntro] = useState("");
  const cardFormData = {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    clientName,
    companyDESCRIP,
    productName,
    productImageURL,
    signatureURL,
    intro,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setRole,
    setClientName,
    setCompanyDESCRIP,
    setProductName,
    setProductImageURL,
    setSignatureURL,
    setIntro,
  };

  //const needed for creating a new card and columns
  const [columnTotals, setColumnTotals] = useState({});
  const [columns, setColumns] = useState(initialColumns);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(dayjs());
  const [editMode, setEditMode] = useState(false);
  const requiredCardData = {
    title,
    amount,
    date,
    editMode,
    columnTotals,
    columns,
    setColumnTotals,
    setColumns,
    setOpen,
    setEditMode,
    setDate,
    setTitle,
    setAmount,
  };

  /*
the createProposalCard function creates a new proposal card, updates the state of the Kanban board,
and sends GraphQL requests to create the card, sub-sections, and form data.
  */
  const createProposalCard = async (
    updatedTitle,
    updatedAmount,
    updatedDate
  ) => {
    const cardObj = {
      id: uuid().slice(0, 8),
      title: updatedTitle,
      amount: updatedAmount,
      date: updatedDate,
      Presentation_Status: "create",
      Column_id: 0,
      Presentation_Id: "",
    };
    cardObj.subSection = [
      {
        text: "Personal Info",
        status: PersonalInfo,
        cardId: cardObj.id,
      },
      {
        text: "Background",
        status: Background,
        cardId: cardObj.id,
      },
      {
        text: "Approach",
        status: Approach,
        cardId: cardObj.id,
      },
      {
        text: "Investment",
        status: Investment,
        cardId: cardObj.id,
      },
      {
        text: "Support",
        status: Support,
        cardId: cardObj.id,
      },
      {
        text: "Case Studies",
        status: CaseStudies,
        cardId: cardObj.id,
      },
      {
        text: "Challenges",
        status: Challenges,
        cardId: cardObj.id,
      },
      {
        text: "Scope",
        status: Scope,
        cardId: cardObj.id,
      },
      {
        text: "Timeline",
        status: Timeline,
        cardId: cardObj.id,
      },
      {
        text: "About Us",
        status: AboutUs,
        cardId: cardObj.id,
      },
      {
        text: "Terms",
        status: Terms,
        cardId: cardObj.id,
      },
    ];

    /*
This code updates the state of columns in a Kanban board. 
It adds a new card object to the "Solution Pending" column and calculates the total amount of each
column based on the amount of each card in the column.
It also filters out any sub-sections in the card object that do not have text.
    */

    setColumns((prevColumns) => {
      const defaultColumns = {
        0: { name: "Solution Pending", items: [] },
        1: { name: "Quote Pending", items: [] },
        2: { name: "Schedule Pending", items: [] },
        3: { name: "Proposal Pending", items: [] },
        4: { name: "Proposal Finalised", items: [] },
      };
      const columns = prevColumns || defaultColumns;
      const updatedColumns = {
        ...columns,
        0: {
          ...columns[0],
          items: [...columns[0].items, cardObj],
        },
      };
      const columnTotals = Object.entries(updatedColumns).reduce(
        (totals, [columnId, column]) => {
          const columnTotal = column.items.reduce(
            (total, item) => total + item.amount,
            0
          );
          return { ...totals, [columnId]: columnTotal };
        },
        {}
      );
      setColumnTotals(columnTotals);
      return updatedColumns;
    });
    const validSubSections = cardObj.subSection.filter(
      (section) => section.text != null
    );
    setOpen(false);

    try {
      // Wait for the card to be created before inserting the sub-sections

      let chatGPTResponse = "";
      if (aiAssistChecked) {
        const response = await fetch(
          "http://localhost:4000/get-openai-response",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputMessage: companyDESCRIP }),
          }
        );

        const data = await response.json();
        chatGPTResponse = data;
        console.log("chatGPTResponse: ", chatGPTResponse);
        setAiAssistChecked(false);
      }
      let chatGPTIntroResponse = "";

      if (generateIntro) {
        const response = await fetch(
          "http://localhost:4000/get-openai-Intro-response",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputMessage: companyDESCRIP }),
          }
        );

        const data = await response.json();
        chatGPTIntroResponse = data;
        console.log("chatGPTIntroResponse: ", chatGPTIntroResponse);
        setGenerateIntro(false);
      }
      await sendGraphQLRequest(CREATE_CARD, {
        id: cardObj.id,
        title: cardObj.title,
        amount: cardObj.amount,
        date: cardObj.date,
        Presentation_Status: cardObj.Presentation_Status,
        Column_id: cardObj.Column_id,
        Presentation_Id: cardObj.Presentation_Id,
        description: chatGPTResponse || companyDESCRIP,
        product_Name: productName,
        product_Image_URL: productImageURL,
        signature_URL: signatureURL,
        intro: chatGPTIntroResponse || intro,
      });

      for (const section of validSubSections) {
        await sendGraphQLRequest(CREATE_CARD_SUBSECTION, {
          text: section.text,
          status: section.status,
          Item_Id: section.cardId,
        });
      }
    } catch (error) {
      console.error("Error creating card and sub-sections:", error);
    }

    try {
      await sendGraphQLRequest(CREATE_FORM_DATA, {
        Item_Id: cardObj.id,
        contact_ID: parseInt(uuid().replace(/\D/g, "").slice(0, 8)),
        first_Name: firstName,
        last_Name: lastName,
        email: email,
        phone_Number: phoneNumber,
        client_Name: clientName,
        role: role,
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setRole("");
      setClientName("");
    } catch (error) {
      console.error("Error updating form data in list:", error);
    }

    return cardObj;
  };
  const [userEmail, setUserEmail] = useState(null);
  const verifyGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);

    const response = await fetch("http://localhost:4000/verify-login-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const { userEmail } = await response.json();
    setUserEmail(userEmail);
    console.log("userEmail: ", userEmail); // this gets the email of the user successfully
  };
  const logOut = () => {
    googleLogout();
    setUserEmail(null);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AiAssistContext.Provider
        value={{
          aiAssistChecked,
          setAiAssistChecked,
          generateIntro,
          setGenerateIntro,
          sigCanvas,
        }}
      >
        <div className="App">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Header />
            <Box
              sx={{
                margin: 3,

                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" sx={{ margin: "24px" }}>
                Proposals
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifycontent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  color="primary"
                  sx={{ marginBottom: 2 }}
                >
                  Create Proposal
                </Button>
                {userEmail ? (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ width: "200px" }}
                    onClick={logOut}
                  >
                    Log out
                    <img src={GoogleLogo} style={{ marginLeft: "10px" }}></img>
                  </Button>
                ) : (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      verifyGoogleLogin(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    cookiePolicy={"single_host_origin"}
                    useOneTap
                  />
                )}
              </Box>
            </Box>
            <ProposalModal
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              cardSubSectionData={cardSubSectionData}
              cardFormData={cardFormData}
              requiredCardData={requiredCardData}
              createProposalCard={createProposalCard}
            />
            <MyList
              cardSubSectionData={cardSubSectionData}
              cardFormData={cardFormData}
              requiredCardData={requiredCardData}
              userEmail={userEmail}
            />
          </GoogleOAuthProvider>
        </div>
      </AiAssistContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
