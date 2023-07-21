import { useState } from "react";
import { MenuItem, FormControl, Select } from "@mui/material";

export default function DropdownMenu() {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <FormControl>
      <Select
        value={selectedOption}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Select a Category" }}
      >
        <MenuItem
          value=""
          disabled
        >
          Select a Category
        </MenuItem>
        <MenuItem value="option1">Option 1</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        <MenuItem value="option3">Option 3</MenuItem>
      </Select>
    </FormControl>
  );
}
