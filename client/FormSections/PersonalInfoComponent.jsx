import React, { useState, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { v4 as uuid } from "uuid";
import { DebounceInput } from "react-debounce-input";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const DebounceInputWrapper = forwardRef((props, ref) => (
  <DebounceInput element="input" {...props} inputRef={ref} />
));

export default function PersonalInfoComponent({
  handlePersonalInfo,
  PersonalInfo,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  role,
  setRole,
  emailError,
  setEmailError,
}) {
  const Roboto = '"Roboto", sans-serif';

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Here is a simple validation check using regex
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(e.target.value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: "#191b1c" }}
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        >
          <Typography
            sx={{
              m: 1,
              fontFamily: Roboto,
              fontSize: 18,
              width: "100%",
              color: "white",
            }}
            component="div"
          >
            Personal Information
          </Typography>
          <ToggleButtonGroup
            value={PersonalInfo}
            exclusive
            onChange={handlePersonalInfo}
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
            label="First Name"
            variant="outlined"
            sx={{ marginTop: "10px" }}
            fullWidth
            InputProps={{
              inputComponent: DebounceInputWrapper,
              inputProps: {
                debounceTimeout: 800,
                onChange: (e) => setFirstName(e.target.value),
                value: firstName,
              },
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            sx={{ marginTop: "10px" }}
            fullWidth
            InputProps={{
              inputComponent: DebounceInputWrapper,
              inputProps: {
                debounceTimeout: 800,
                onChange: (e) => setLastName(e.target.value),
                value: lastName,
              },
            }}
          />
          <TextField
            error={emailError}
            helperText={emailError ? "Please enter a valid email" : null}
            label="Email"
            variant="outlined"
            sx={{ marginTop: "10px" }}
            fullWidth
            InputProps={{
              inputComponent: DebounceInputWrapper,
              inputProps: {
                debounceTimeout: 800,
                onChange: handleEmailChange,
                value: email,
              },
            }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            sx={{ marginTop: "10px" }}
            fullWidth
            InputProps={{
              inputComponent: DebounceInputWrapper,
              inputProps: {
                debounceTimeout: 800,
                onChange: (e) => setPhoneNumber(e.target.value),
                value: phoneNumber,
              },
            }}
          />
          <TextField
            label="Role"
            variant="outlined"
            sx={{ marginTop: "10px" }}
            fullWidth
            InputProps={{
              inputComponent: DebounceInputWrapper,
              inputProps: {
                debounceTimeout: 800,
                onChange: (e) => setRole(e.target.value),
                value: role,
              },
            }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
