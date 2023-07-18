import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import ProposalForm from "./ProposalForm";

export default function ProposalModal({
  open,
  onClose,
  handleSubmit,
  cardSubSectionData,
  cardFormData,
  requiredCardData,
  createProposalCard,
  selectedItemId,
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
    companyDESCRIP,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setRole,
    clientName,
    setClientName,
    setCompanyDESCRIP,
    productName,
    setProductName,
    productImageURL,
    setProductImageURL,
    signatureURL,
    setsignatureURL,
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "90%",
          bgcolor: "#fff",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 4,
            paddingBottom: "10px",
          }}
        >
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Proposal Form
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 0 }}>
          <Typography variant="body1" component="div">
            <ProposalForm
              cardSubSectionData={cardSubSectionData}
              cardFormData={cardFormData}
              requiredCardData={requiredCardData}
              createProposalCard={createProposalCard}
              onClose={onClose}
              handleSubmit={handleSubmit}
              selectedItemId={selectedItemId}
            />
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
