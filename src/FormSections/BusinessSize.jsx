import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";

const BusinessSize = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <FormControl
      component="fieldset"
      sx={{ marginY: "10px" }}
    >
      <FormLabel component="legend">Business Size 'not working':</FormLabel>
      <RadioGroup
        row
        value={selectedValue}
        onChange={handleChange}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option1"
              control={<Radio />}
              label="1-10"
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option2"
              control={<Radio />}
              label="11-50"
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option3"
              control={<Radio />}
              label="51-200"
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option4"
              control={<Radio />}
              label="200-500"
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option5"
              control={<Radio />}
              label="501-1000"
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <FormControlLabel
              value="option6"
              control={<Radio />}
              label="1000+"
            />
          </Grid>
        </Grid>
      </RadioGroup>
    </FormControl>
  );
};
export default BusinessSize;
