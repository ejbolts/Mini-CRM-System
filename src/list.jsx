/*
This is the main List component that includes the entire logic for the application's list functionality. 
The responsibilities include managing the list's state, handling drag and drop functionality, managing modal display,
fetching data from the backend service, updating column totals, and handling user interactions such as deleting and editing items.
*/
import { useState, useEffect, useContext } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { v4 as uuid } from "uuid";
import ProposalCard from "./Card";
import { Alert, Badge, Box } from "@mui/material";
import ProposalModal from "./ProposalModal";

import {
  getCardsData,
  getCardsSubSectionData,
  deleteCardData,
  updateSubvaluesData,
  updateCardsPositionData,
  updateCardPresentationData,
  sendGraphQLRequest,
} from "./serverRequests";
import {
  GET_CARDS,
  GET_CARDS_SUBSECTIONS,
  DELETE_CARD,
  UPDATE_SUBVALUES,
  UPDATE_CARD_POSITION,
  UPDATE_CARD_PRESENTATION,
  UPDATE_CARD,
  UPDATE_FORM_DATA,
  GET_FORM_DATA,
} from "./queryConsts";
import { AiAssistContext } from "./App";

export default function MyList({
  cardSubSectionData,
  cardFormData,
  requiredCardData,
  userEmail,
}) {
  const {
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
  } = cardSubSectionData;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    clientName,
    companyDESCRIP,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setRole,
    setClientName,
    setCompanyDESCRIP,
    productImageURL,
    setProductImageURL,
    productName,
    setProductName,
    signatureURL,
    setSignatureURL,
    intro,
    setIntro,
  } = cardFormData;

  const {
    title,
    amount,
    date,
    editMode,
    columnTotals,
    columns,
    setColumnTotals,
    setColumns,
    setEditMode,
    setDate,
    setTitle,
    setAmount,
  } = requiredCardData;

  const updateColumnTotals = (updatedColumns) => {
    const newColumnTotals = {};
    Object.entries(updatedColumns).forEach(([columnId, column]) => {
      const columnTotal = column.items.reduce(
        (total, item) => total + item.amount,
        0
      );
      newColumnTotals[columnId] = columnTotal;
    });
    setColumnTotals(newColumnTotals);
  };

  useEffect(() => {
    updateColumnTotals(columns);
  }, [columns]);
  /*
the onDragEnd function handles the drag and drop event, rearranges items within a column, or moves items between columns.
 It updates the state of the columns and triggers the update of the card positions in the server data when necessary.
*/
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      const items = [...sourceColumn.items];
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items,
        },
      });
    } else {
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const updatedColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      setColumns(updatedColumns);
      await updateCardsPositionData(UPDATE_CARD_POSITION, {
        id: removed.id,
        Column_id: parseInt(destination.droppableId),
      });
    }
  };

  const [open, setOpen] = useState(false);
  const openCardProposalModal = (itemId) => {
    setOpen(true);
  };
  const [itemsFromBackend, setItemsFromBackend] = useState([]);
  /*
the handleDelete function handles the deletion of a card. It prompts the user for confirmation,
 updates the columns state by removing the deleted card, sends a GraphQL mutation to delete the card,
and updates any relevant totals or summaries.
*/
  const handleDelete = (columnId, itemId) => {
    const result = window.confirm(
      "Deleting this card will remove its proposal and presentation. Are you sure you want to delete this card?"
    );
    if (result) {
      console.log("Delete proposal and card");

      const column = columns[columnId];
      const newItems = column.items.filter((item) => item.id !== itemId);

      const updatedColumns = {
        ...columns,
        [columnId]: {
          ...column,
          items: newItems,
        },
      };
      const queryDeleteCard = async () => {
        const removedCard = await deleteCardData(DELETE_CARD, {
          Item_Id: itemId,
        });
        return removedCard;
      };
      setColumns(updatedColumns);
      updateColumnTotals(updatedColumns);
      queryDeleteCard();
    } else {
      console.log("Cancelling delete.");
    }
  };
  /*
the groupSubSectionsByCardId function groups an array of subsections by their respective card IDs,
 creating an object where each card ID is associated with an array of its corresponding subsections.
*/
  const groupSubSectionsByCardId = (subSections) => {
    const grouped = {};
    subSections.forEach((subSection) => {
      const cardId = subSection.Item_Id;
      if (!grouped[cardId]) {
        grouped[cardId] = [];
      }
      grouped[cardId].push(subSection);
    });
    console.log("grouped", grouped);
    return grouped;
  };
  /*
the useEffect hook fetches card data and associated subsection data from the server when the component mounts.
 It groups the subsections by card ID, combines the card and subsection data, and updates the state with the modified
card objects that include their associated subsections.
*/
  useEffect(() => {
    const fetchCards = async () => {
      const cardData = await getCardsData(GET_CARDS);
      const subSectionData = await getCardsSubSectionData(
        GET_CARDS_SUBSECTIONS
      );
      if (subSectionData) {
        const subSectionsGroupedByCardId = groupSubSectionsByCardId(
          subSectionData.getCardSubSections
        );
        console.log("subSectionsGroupedByCardId", subSectionsGroupedByCardId);
        console.log("cardData.getCards", cardData.getCards);
        const updatedItems = cardData.getCards.map((item) => {
          const subSections = subSectionsGroupedByCardId[item.id] || [];
          return { ...item, subSection: subSections };
        });

        setItemsFromBackend(updatedItems);
      } else {
        console.error("Error fetching subSectionData");
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    // loops through the columnsFromBackend array, and for each column, it filters the
    // itemsFromBackend array to get the items that belong to that column (based on the Column_id property).
    // It then updates the items property of that column object with the filtered items.

    if (itemsFromBackend.length > 0) {
      const updatedColumns = columns.map((column) => {
        const columnItems = itemsFromBackend.filter(
          (item) => item.Column_id === column.id
        );
        return { ...column, items: columnItems };
      });
      updateColumnTotals(updatedColumns);

      setColumns(updatedColumns);
    }
  }, [itemsFromBackend]);

  const findColumnItem = (itemId) => {
    let selectedItem;
    for (const column of Object.values(columns)) {
      const foundItem = column.items.find((item) => item.id === itemId);
      if (foundItem) {
        return (selectedItem = foundItem);
      }
    }
  };
  /*
the handleEdit function handles the edit action for a specific item. It fetches form data,
 sets the state variables for the form fields, updates the state for the item details, 
 and performs any necessary actions based on the subSection data.
  */
  const handleEdit = async (itemId) => {
    let selectedItem = findColumnItem(itemId);
    try {
      const responseData = await getCardsData(GET_FORM_DATA);
      const responseData2 = await getCardsData(GET_CARDS);
      if (responseData && responseData.getFormData) {
        const loadItemData = responseData.getFormData.find(
          (item) => item.Item_Id === itemId
        );
        if (loadItemData) {
          const {
            first_Name,
            last_Name,
            email,
            phone_Number,
            role,
            client_Name,
          } = loadItemData;
          setFirstName(first_Name);
          setLastName(last_Name);
          setEmail(email);
          setPhoneNumber(phone_Number);
          setRole(role);
          setClientName(client_Name);
        }

        if (responseData2 && responseData2.getCards) {
          const loadItemData2 = responseData2.getCards.find(
            (item) => item.id === itemId
          );
          if (loadItemData2) {
            const {
              description,
              product_Name,
              product_Image_URL,
              signatureURL,
            } = loadItemData2;
            setCompanyDESCRIP(description);
            setProductName(product_Name);
            setProductImageURL(product_Image_URL);
          }
          console.log(loadItemData2);
        }
      } else {
        console.log("responseData2 does not contain getCardsData");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setEditMode(true);
    setTitle(selectedItem.title);
    setAmount(selectedItem.amount);
    setDate(selectedItem.date);

    selectedItem.subSection.forEach((subSection) => {
      const handler = handlers[subSection.text];
      console.log("Text, status:", subSection.text, subSection.status);
      if (handler) {
        handler(event, subSection.status);
      }
    });

    setSelectedItemId(itemId);
    openCardProposalModal(itemId);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handlers = {
    "Personal Info": handlePersonalInfo,
    Background: handleBackground,
    Approach: handleApproach,
    Investment: handleInvestment,
    Support: handleSupport,
    "Case Studies": handleCaseStudies,
    Challenges: handleChallenges,
    Scope: handleScope,
    Timeline: handleTimeline,
    "About Us": handleAboutUs,
    Terms: handleTerms,
  };

  /*
the handleSubmit function handles the submission of a form or card update. It updates the relevant data in the database,
 updates the status of subSections based on form data, updates subSection values in the database, and closes the form or modal.
  */ const {
    aiAssistChecked,
    setAiAssistChecked,
    generateIntro,
    setGenerateIntro,
  } = useContext(AiAssistContext);
  const handleSubmit = async (editMode) => {
    let newDes = companyDESCRIP; // idk why i need this here but it works
    console.log("companyDESCRIP", newDes);
    console.log("editMode", editMode);
    if (editMode == undefined) {
      setOpen(false);
    }
    let selectedItem = findColumnItem(selectedItemId);
    selectedItem.title = title;
    selectedItem.amount = amount;
    selectedItem.date = date;
    console.log("selectedItem", selectedItem);
    updateColumnTotals(columns);
    try {
      await sendGraphQLRequest(UPDATE_FORM_DATA, {
        Item_Id: selectedItem.id,
        first_Name: firstName,
        last_Name: lastName,
        email: email,
        phone_Number: phoneNumber,
        role: role,
        client_Name: clientName,
      });
    } catch (error) {
      console.error("Error updating form data in list:", error);
    }
    try {
      let chatGPTResponse = "";
      console.log("aiAssistChecked", aiAssistChecked);
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
      }

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
      }
      setGenerateIntro(false);
      setAiAssistChecked(false);
      console.log("signature_URL", signatureURL);

      await sendGraphQLRequest(UPDATE_CARD, {
        id: selectedItem.id,
        title: selectedItem.title,
        amount: selectedItem.amount,
        date: selectedItem.date,
        Presentation_Status: selectedItem.Presentation_Status,
        Presentation_Id: selectedItem.Presentation_Id,
        description: chatGPTResponse || newDes, // newdes value is fine here
        product_Name: productName,
        product_Image_URL: productImageURL,
        signature_URL: signatureURL,
        intro: intro,
      });
      const responseData = await getCardsData(GET_FORM_DATA);
      const responseData2 = await getCardsData(GET_CARDS);

      const PersonalInfoItemData = responseData.getFormData.find(
        (item) => item.Item_Id === selectedItem.id
      );
      let BackgroundItemData = responseData.getFormData.find(
        (item) => item.Item_Id === selectedItem.id
      );

      const appendData = responseData2.getCards.find(
        (item) => item.id === selectedItem.id
      );
      console.log("appendData", appendData);
      if (appendData) {
        BackgroundItemData = { ...BackgroundItemData, ...appendData };
      }

      const { first_Name, last_Name, email, phone_Number, role } =
        PersonalInfoItemData;
      console.log("BackgroundItemData", BackgroundItemData);
      const { client_Name, description, product_Name } = BackgroundItemData;

      // If all of these fields have non-empty value, update the status of the relevant subSection to "Done"
      if (first_Name && last_Name && email && phone_Number && role) {
        selectedItem.subSection = selectedItem.subSection.map((subSection) => {
          if (subSection.text === "Personal Info") {
            subSection.status = "Done";
            handlePersonalInfo(event, "Done");
          }
          return subSection;
        });
      } else if (first_Name || last_Name || email || phone_Number || role) {
        // If any of these fields have non-empty value, update the status of the relevant subSection to "In Progress"
        selectedItem.subSection = selectedItem.subSection.map((subSection) => {
          if (subSection.text === "Personal Info") {
            subSection.status = "InProgress";
            handlePersonalInfo(event, "InProgress");
          }
          return subSection;
        });
      }

      // If all of these fields have non-empty value, update the status of the relevant subSection to "Done"

      if (client_Name && description && product_Name) {
        selectedItem.subSection = selectedItem.subSection.map((subSection) => {
          if (subSection.text === "Background") {
            subSection.status = "Done";
            handleBackground(event, "Done");
          }
          return subSection;
        });
      } else if (client_Name || description || product_Name) {
        // dont actually use First name here
        // If any of these fields have non-empty value, update the status of the relevant subSection to "In Progress"
        selectedItem.subSection = selectedItem.subSection.map((subSection) => {
          if (subSection.text === "Background") {
            subSection.status = "InProgress";
            handleBackground(event, "InProgress");
          }
          return subSection;
        });
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }

    const updateSubvalues = () => {
      const updatedSubsections = selectedItem.subSection.map((subSection) => {
        console.log(" this section is being run updatesubvalues");

        switch (subSection.text) {
          case "Personal Info":
            subSection.status = subSection.status; // this is a temp fix, ideally should be PersonalInfo but state doesn't update in time
            break;
          case "Background":
            subSection.status = subSection.status;
            break;
          case "Approach":
            subSection.status = Approach;
            break;
          case "Investment":
            subSection.status = Investment;
            break;
          case "Support":
            subSection.status = Support;
            break;
          case "Case Studies":
            subSection.status = CaseStudies;
            break;
          case "Challenges":
            subSection.status = Challenges;
            break;
          case "Scope":
            subSection.status = Scope;
            break;
          case "Timeline":
            subSection.status = Timeline;
            break;
          case "About Us":
            subSection.status = AboutUs;
            break;
          case "Terms":
            subSection.status = Terms;
            break;
          default:
            break;
        }
        return subSection;
      });
      const validSubSections = updatedSubsections.filter(
        (section) => section.status !== null && section.status !== undefined
      );

      console.log("updatedSubsections", validSubSections);
      updateSubvaluesData(validSubSections, UPDATE_SUBVALUES);

      return updatedSubsections;
    };

    updateSubvalues();

    setOpen(false);
  };

  /*
the handleUpdate function handles the update of a presentation for a specific item. It prompts the user for confirmation,
 updates the relevant status and button state variables, sends a POST request to update the presentation, 
 and handles any errors that occur during the process.
  */
  const handleUpdate = async (itemId, presentationId, title) => {
    const result = window.confirm(
      "Updating presentation may overwrite any manually changes made. Are you sure you want to update?"
    );
    let selectedItem = findColumnItem(itemId);

    const responseData = await getCardsData(GET_FORM_DATA);
    const responseData2 = await getCardsData(GET_CARDS);

    let BackgroundItemData = responseData.getFormData.find(
      (item) => item.Item_Id === selectedItem.id
    );
    const appendData = responseData2.getCards.find(
      (item) => item.id === selectedItem.id
    );

    if (appendData) {
      BackgroundItemData = { ...BackgroundItemData, ...appendData };
    }
    console.log("BackgroundItemData", BackgroundItemData);

    const { client_Name, description } = BackgroundItemData;

    // Update the presentationStatus of the found item

    if (result) {
      try {
        selectedItem.Presentation_Status = "loading";
        setPresentationBtn("loading");
        setPresentationBtnMessage("Updating Presentation");
        console.log("clientName", clientName);
        console.log("description", description);
        console.log("productImageURL", productImageURL);
        console.log("productName", productName);
        const response = await fetch(
          "http://localhost:4000/update-presentation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              presentationId,
              proposalTitle: title,
              newSubTitle: client_Name,
              newDescription: description,
              newProductName: productName,
              newProductImageURL: productImageURL,
              newSignatureURL: signatureURL,
            }),
          }
        );

        if (!response.ok) {
          selectedItem.Presentation_Status = "create";
          setPresentationBtn("create");
          setPresentationBtnMessage("create presentation");
          throw new Error(
            `Failed to create presentation response status: ${response.status}`
          );
        }
        selectedItem.Presentation_Status = "view";
        setPresentationBtn("view");
      } catch (error) {
        console.error("Error updating presentation:", error);
        alert(`Presentation update failed: ${error}`);
      }
    } else {
      console.log("Cancelling update.");
    }
  };

  /*
the handleCreateProposalClick function handles the click event for creating a proposal presentation. It checks if the user is signed in,
updates the presentation status and button state variables, sends a POST request to create and duplicate the presentation,
 updates the presentation data in the database, and handles any errors that occur during the process.
  */
  const [presentationBtn, setPresentationBtn] = useState();
  const handleCreateProposalClick = async (itemId, userEmail, title) => {
    if (userEmail === null) {
      alert("Please Sign in with Google to create a proposal presentation.");
      return;
    }
    let selectedItem = findColumnItem(itemId);
    const responseData = await getCardsData(GET_FORM_DATA);
    const responseData2 = await getCardsData(GET_CARDS);

    let BackgroundItemData = responseData.getFormData.find(
      (item) => item.Item_Id === selectedItem.id
    );
    const appendData = responseData2.getCards.find(
      (item) => item.id === selectedItem.id
    );

    if (appendData) {
      BackgroundItemData = { ...BackgroundItemData, ...appendData };
    }

    const { client_Name, description } = BackgroundItemData;

    // Update the presentationStatus of the found item
    selectedItem.Presentation_Status = "loading";
    setPresentationBtn("loading");
    setPresentationBtnMessage("Creating Presentation");

    try {
      // Call the new route to create and duplicate the presentation
      // waits for the response from the server endpoint

      const response = await fetch(
        "http://localhost:4000/create-and-duplicate-presentation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            proposalTitle: title,
            newSubTitle: client_Name,
            newDescription: description,
            newProductName: productName,
            newProductImageURL: productImageURL,
            newSignatureURL: signatureURL,
          }),
        }
      );

      if (!response.ok) {
        selectedItem.Presentation_Status = "create";
        setPresentationBtn("create");
        setPresentationBtnMessage("Create Presentation");
        alert(
          "Failed to create presentation check server logs for more details"
        );
        throw new Error(`Error creating presentation: ${response.status}`);
      }

      const { NewPresentationID } = await response.json();

      // used to update the state of the presentation button in DB from create to view
      await updateCardPresentationData(UPDATE_CARD_PRESENTATION, {
        id: selectedItem.id,
        Presentation_Status: "view",
        Presentation_Id: NewPresentationID,
      });

      selectedItem.Presentation_Status = "view";
      selectedItem.Presentation_Id = NewPresentationID;
      setPresentationBtn("view");
      setSelectedItemId(presentationBtn);
    } catch (error) {
      console.error("Error creating presentation:", error);
      setPresentationBtn("create");
    }
  };

  const [selectedItemId, setSelectedItemId] = useState(null);
  useEffect(() => {
    if (selectedItemId === null) return;

    const updatedColumns = Object.entries(columns).map(([key, column]) => {
      const updatedItems = column.items.map((item) => {
        if (item.id === selectedItemId) {
          return {
            ...item,
            subSection: [
              {
                text: "Personal Info",
                status: PersonalInfo,
                cardId: item.id,
              },
              {
                text: "Background",
                status: Background,
                cardId: item.id,
              },
              {
                text: "Approach",
                status: Approach,
                cardId: item.id,
              },
              {
                text: "Investment",
                status: Investment,
                cardId: item.id,
              },
              {
                text: "Support",
                status: Support,
                cardId: item.id,
              },
              {
                text: "Case Studies",
                status: CaseStudies,
                cardId: item.id,
              },
              {
                text: "Challenges",
                status: Challenges,
                cardId: item.id,
              },
              {
                text: "Scope",
                status: Scope,
                cardId: item.id,
              },
              {
                text: "Timeline",
                status: Timeline,
                cardId: item.id,
              },
              {
                text: "About Us",
                status: AboutUs,
                cardId: item.id,
              },
              {
                text: "Terms",
                status: Terms,
                cardId: item.id,
              },
            ],
          };
        }
        return item;
      });

      return {
        ...column,
        items: updatedItems,
      };
    });

    setColumns(updatedColumns);
  }, [
    PersonalInfo,
    Background,
    Approach,
    Investment,
    Support,
    CaseStudies,
    Challenges,
    Scope,
    Timeline,
    AboutUs,
    Terms,
    selectedItemId,
  ]);

  const viewPresentation = (Presentation_Id) => {
    window.open(
      `https://docs.google.com/presentation/d/${Presentation_Id}/edit?usp=sharing`
    );
  };
  const [presentationBtnMessage, setPresentationBtnMessage] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <DragDropContext
        onDragEnd={(result) =>
          onDragEnd(result, columns, setColumns, columnTotals, setColumnTotals)
        }
      >
        <ProposalModal
          open={open}
          onClose={() => setOpen(false)}
          handleSubmit={handleSubmit}
          cardSubSectionData={cardSubSectionData}
          setOpen={setOpen}
          selectedItemId={selectedItemId}
          cardFormData={cardFormData}
          requiredCardData={requiredCardData}
        />

        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <Badge color="info" badgeContent={column.items.length}>
                <h2
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginBottom: 0,
                    marginTop: 0,
                    padding: 8,
                    paddingTop: 0,
                  }}
                >
                  {column.name}
                </h2>
              </Badge>
              <div style={{ margin: 8, height: "510px", overflowY: "auto" }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <>
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "#eeeeee",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <ProposalCard
                                        Title={item.title}
                                        Amount={item.amount}
                                        Date={item.date}
                                        PositionNumber={index + 1}
                                        onEdit={() => handleEdit(item.id)}
                                        onUpdate={() =>
                                          handleUpdate(
                                            item.id,
                                            item.Presentation_Id,
                                            item.title
                                          )
                                        }
                                        onDelete={() =>
                                          handleDelete(columnId, item.id)
                                        }
                                        subSection={
                                          item.subSection ? item.subSection : []
                                        }
                                        presentationBtn={
                                          item.Presentation_Status
                                        }
                                        presentationBtnMsg={
                                          presentationBtnMessage
                                        }
                                        handleCreateProposalClick={() =>
                                          handleCreateProposalClick(
                                            item.id,
                                            userEmail,
                                            item.title
                                          )
                                        }
                                        handleViewPresentation={() =>
                                          viewPresentation(item.Presentation_Id)
                                        }
                                      />
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </>
                    );
                  }}
                </Droppable>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#f4f6f9",
                  width: "100%",
                }}
              >
                <p style={{ paddingLeft: 8 }}>Total:</p>
                <p style={{ color: "#7c7c7c", paddingRight: 8 }}>
                  AU$
                  {numberWithCommas(columnTotals?.[columnId] ?? 0)}
                </p>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}
