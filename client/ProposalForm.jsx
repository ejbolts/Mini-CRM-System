import React, { useState, useLayoutEffect } from "react";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import RequiredCardInfo from "./FormSections/RequiredCardInfo";
import PersonalInfoComponent from "./FormSections/PersonalInfoComponent";
import BackgroundComponent from "./FormSections/BackgroundComponent";
import ImageGenerator from "./FormSections/ImageGenerator";
import TermsComponent from "./FormSections/TermsComponent";

const ProposalForm = ({
  cardSubSectionData,
  cardFormData,
  createProposalCard,
  requiredCardData,
  handleSubmit,
}) => {
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
    productName,
    productImageURL,
    signatureURL,
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
    setOpen,
    setEditMode,
    setDate,
    setTitle,
    setAmount,
  } = requiredCardData;

  const Roboto = '"Roboto", sans-serif';

  const [emailError, setEmailError] = useState(false);
  /*
The useLayoutEffect hook is used to perform side effects after the component has been rendered.
 In this case, it checks the editMode variable and updates the input field values accordingly. 
 If editMode is true, the titleRef, amountRef, and dateRef values are set to the corresponding
 values from the title, amount, and date variables. If editMode is false, the input field values are cleared,
and additional state variables (setFirstName, setLastName, setEmail, setPhoneNumber, setRole) are reset.
  */

  useLayoutEffect(() => {
    if (!editMode) {
      setTitle("");
      setAmount("");
      setDate("DD/MM/YYYY");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setRole("");
    }
  }, [editMode]);

  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    if (!title || !amount || !date || date === "DD/MM/YYYY") {
      console.log(title, amount, date);
      setErrorMessage("All fields are required.");
      return false;
    }
    if (emailError) {
      return false;
    }

    setErrorMessage("");
    return true;
  };
  /*
the handleFormSubmit function handles the submission of the form, performs form validation, 
updates the state variables, and calls the necessary functions based on the editMode status

*/
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      if (editMode) {
        handleSubmit();
      } else {
        try {
          const formattedDate = dayjs(date).format("DD/MM/YYYY");
          await createProposalCard(title, amount, formattedDate);
        } catch (error) {
          console.error("Error creating card:", error);
        }
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box>
        <RequiredCardInfo
          errorMessage={errorMessage}
          title={title}
          setTitle={setTitle}
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
        />
        <PersonalInfoComponent
          handlePersonalInfo={handlePersonalInfo}
          PersonalInfo={PersonalInfo}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          role={role}
          setRole={setRole}
          emailError={emailError}
          setEmailError={setEmailError}
        />

        <BackgroundComponent
          Background={Background}
          handleBackground={handleBackground}
          clientName={clientName}
          setClientName={setClientName}
          companyDESCRIP={companyDESCRIP}
          setCompanyDESCRIP={setCompanyDESCRIP}
          productName={productName}
          setProductName={setProductName}
        />

        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Approach
            </Typography>
            <ToggleButtonGroup
              value={Approach}
              exclusive
              onChange={handleApproach}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Challenges
            </Typography>
            <ToggleButtonGroup
              value={Challenges}
              exclusive
              onChange={handleChallenges}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Scope
            </Typography>
            <ToggleButtonGroup
              value={Scope}
              exclusive
              onChange={handleScope}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Timeline
            </Typography>
            <ToggleButtonGroup
              value={Timeline}
              exclusive
              onChange={handleTimeline}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Investment
            </Typography>
            <ToggleButtonGroup
              value={Investment}
              exclusive
              onChange={handleInvestment}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              About Us
            </Typography>
            <ToggleButtonGroup
              value={AboutUs}
              exclusive
              onChange={handleAboutUs}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Case Studies
            </Typography>
            <ToggleButtonGroup
              value={CaseStudies}
              exclusive
              onChange={handleCaseStudies}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#191b1c" }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          >
            <Typography
              sx={{
                color: "white",
                m: 1,
                width: "100%",
                fontFamily: Roboto,
                fontSize: 18,
              }}
              component="div"
            >
              Support
            </Typography>
            <ToggleButtonGroup
              value={Support}
              exclusive
              onChange={handleSupport}
              aria-label="Section Status"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              <ToggleButton color="success" value="Done" sx={{ color: "grey" }}>
                Done
              </ToggleButton>

              <ToggleButton
                color="warning"
                value="InProgress"
                sx={{ color: "grey" }}
              >
                InProgress
              </ToggleButton>
              <ToggleButton
                color="error"
                value="Cancelled"
                sx={{ color: "grey" }}
              >
                Cancelled
              </ToggleButton>
            </ToggleButtonGroup>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
            <TextField
              label="Description of your company"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <TermsComponent
            Terms={Terms}
            handleTerms={handleTerms}
            signatureURL={signatureURL}
            setSignatureURL={setSignatureURL}
          />
        </Accordion>

        <ImageGenerator
          productName={productName}
          setProductName={setProductName}
          productImageURL={productImageURL}
          setProductImageURL={setProductImageURL}
        />
        <Box mt={1}>
          {editMode ? (
            <Button
              type="submit"
              variant="contained"
              onClick={handleFormSubmit}
              color="primary"
              sx={{ m: 2, mt: 1 }}
            >
              Done
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              onClick={handleFormSubmit}
              color="primary"
              sx={{ m: 2, mt: 1 }}
            >
              Create
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default ProposalForm;
