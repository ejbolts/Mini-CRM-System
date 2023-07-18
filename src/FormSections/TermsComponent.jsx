import React, { useState, useEffect, useRef, useContext } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { v4 as uuid } from "uuid";
import { DebounceInput } from "react-debounce-input";
import BusinessSize from "./BusinessSize";
import DropDown from "../DropDown";
import SignatureCanvas from "react-signature-canvas";
import "../index.css";
import { AiAssistContext } from "../App";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const Roboto = '"Roboto", sans-serif';
export default function TermsComponent({
  Terms,
  handleTerms,
  signatureURL,
  setSignatureURL,
}) {
  const { sigCanvas } = useContext(AiAssistContext);

  const create = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    console.log("URL: ", URL);
    setSignatureURL(URL);
  };

  const clear = () => {
    sigCanvas.current.clear();
    setSignatureURL(null);
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
          Terms
        </Typography>
        <ToggleButtonGroup
          value={Terms}
          exclusive
          onChange={handleTerms}
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

      <SignatureCanvas
        penColor="black"
        canvasProps={{ className: "sigCanvas" }}
        ref={sigCanvas}
      />
      <Button
        color="error"
        sx={{ m: 2, mt: 1 }}
        variant="outlined"
        onClick={clear}
      >
        Clear
      </Button>
      <Button
        color="primary"
        sx={{ m: 2, mt: 1 }}
        variant="contained"
        onClick={create}
      >
        Scan Signature
      </Button>
      {signatureURL && (
        <>
          <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
        </>
      )}
    </Accordion>
  );
}
