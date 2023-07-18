import React, { useContext, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { v4 as uuid } from "uuid";
import { DebounceInput } from "react-debounce-input";
import BusinessSize from "./BusinessSize";
import DropDown from "../DropDown";
import { AiAssistContext } from "../App";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DebounceInputWrapper = forwardRef(({ multiline, ...props }, ref) => (
  <DebounceInput
    element={multiline ? "textarea" : "input"}
    {...props}
    inputRef={ref}
  />
));
const Roboto = '"Roboto", sans-serif';
export default function BackgroundComponent({
  Background,
  handleBackground,
  clientName,
  setClientName,
  companyDESCRIP,
  setCompanyDESCRIP,
  productName,
  setProductName,
}) {
  const {
    aiAssistChecked,
    setAiAssistChecked,
    generateIntro,
    setGenerateIntro,
  } = useContext(AiAssistContext);

  const handleCheckboxChange = (event) => {
    setAiAssistChecked(event.target.checked);
  };
  const handleIntoCheckboxChange = (event) => {
    setGenerateIntro(event.target.checked);
  };

  return (
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
          Background
        </Typography>
        <ToggleButtonGroup
          value={Background}
          exclusive
          onChange={handleBackground}
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
          <ToggleButton color="error" value="Cancelled" sx={{ color: "grey" }}>
            Cancelled
          </ToggleButton>
        </ToggleButtonGroup>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingX: "40px", paddingY: "30px" }}>
        <TextField
          label="Comapny Name"
          variant="outlined"
          sx={{ marginY: "10px" }}
          fullWidth
          InputProps={{
            inputComponent: DebounceInputWrapper,
            inputProps: {
              debounceTimeout: 800,
              onChange: (e) => setClientName(e.target.value),
              value: clientName,
            },
          }}
        />

        <TextField
          label="Description of your company"
          variant="outlined"
          sx={{ marginY: "10px" }}
          multiline
          rows={4}
          fullWidth
          InputProps={{
            inputComponent: DebounceInputWrapper,
            inputProps: {
              debounceTimeout: 800,
              onChange: (e) => setCompanyDESCRIP(e.target.value),
              value: companyDESCRIP,
              multiline: true,
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start", // Align items to start, so the typography starts at the same line as the checkbox
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={aiAssistChecked}
                onChange={handleCheckboxChange}
              />
            }
            label="AI Assist"
          />
          <Typography variant="h8" sx={{ color: "#676767" }}>
            Note: For AI to help please provide a description of your company.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={generateIntro}
                onChange={handleIntoCheckboxChange}
              />
            }
            label="Generate Intro"
          />
          <Typography variant="h8" sx={{ color: "#676767" }}>
            Note: AI will generate an Executive Summary based off the product
            description.
          </Typography>
        </Box>

        <BusinessSize />
        <TextField
          label="Product Name"
          variant="outlined"
          sx={{ marginY: "10px" }}
          fullWidth
          InputProps={{
            inputComponent: DebounceInputWrapper,
            inputProps: {
              debounceTimeout: 800,
              onChange: (e) => setProductName(e.target.value),
              value: productName,
            },
          }}
        />

        <div style={{ padding: "8px 0" }}>
          <DropDown />
        </div>
        <TextField
          label="Product Complexity"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
      </AccordionDetails>
    </Accordion>
  );
}
