import { InputAdornment, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { forwardRef } from "react";
import { DebounceInput } from "react-debounce-input/src";

const DebounceInputWrapper = forwardRef((props, ref) => (
  <DebounceInput
    element="input"
    {...props}
    inputRef={ref}
  />
));

export default function RequiredCardInfo({
  errorMessage,
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
}) {
  return (
    <div style={{ padding: "10px 40px", display: "flex", gap: 10 }}>
      <TextField
        label="Proposal Title"
        variant="outlined"
        sx={{ marginTop: "10px" }}
        error={!!errorMessage}
        helperText={errorMessage}
        required
        InputProps={{
          inputComponent: DebounceInputWrapper,
          inputProps: {
            debounceTimeout: 800,
            onChange: (e) => setTitle(e.target.value),
            value: title,
          },
        }}
      />

      <TextField
        label="Amount - $AUD"
        variant="outlined"
        sx={{ marginTop: "10px" }}
        error={!!errorMessage}
        helperText={errorMessage}
        required
        InputProps={{
          inputComponent: DebounceInputWrapper,
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          inputProps: {
            debounceTimeout: 800,
            onChange: (e) => setAmount(parseInt(e.target.value)),
            value: amount,
          },
        }}
      />

      <DatePicker
        sx={{ marginTop: "10px" }}
        error={!!errorMessage}
        helperText={errorMessage}
        id="outlined-helperText"
        label="Close Date - DD/MM/YYYY"
        format="DD/MM/YYYY"
        value={dayjs(date, "DD/MM/YYYY")}
        onChange={(date) => setDate(dayjs(date))} // Convert to `dayjs` before setting in state
      />
    </div>
  );
}
