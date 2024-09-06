import React, { FC, Dispatch, SetStateAction } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  Grid2,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

// Create a custom theme with new colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#000", // Light blue for primary actions
    },
    background: {
      default: "#CA8A03", // Dark gray for the background
      paper: "#CA8A03", // Lighter gray for paper elements
    },
    text: {
      primary: "#fff", // Soft white for text
      secondary: "#fff", // Softer gray for secondary text
    },
  },
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(8),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    color: theme.palette.text.primary,
    backgroundColor: "#bb8207",
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiInputBase-input": {
    color: theme.palette.text.primary,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiInputBase-input": {
    color: theme.palette.text.primary,
    backgroundColor: "#bb8207",
    borderRadius: theme.shape.borderRadius,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.primary.main,
  },
}));

// Define props interface
interface FiltersProps {
  playersFilter: string | number;
  setPlayersFilter: Dispatch<SetStateAction<string | "all">>;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

// Filters component
const Filters: FC<FiltersProps> = ({
  playersFilter,
  setPlayersFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const handlePlayersFilterChange = (event: SelectChangeEvent<unknown>) => {
    setPlayersFilter((event.target.value as string | "all"));
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledPaper elevation={3}>
       <div className="grid md:grid-cols-2 gap-3">
       <div className="">
          <FormControl fullWidth>
            <InputLabel>Number of Players</InputLabel>
            <StyledSelect
              value={playersFilter}
              onChange={handlePlayersFilterChange}
              label="Number of Players"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Solo">Solo</MenuItem>
              <MenuItem value="Duo">Duo</MenuItem>
              <MenuItem value="Squad">Squad</MenuItem>
            </StyledSelect>
          </FormControl>
        </div>
        <div className=" grid md:grid-cols-2 gap-3">
          <StyledTextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            className=""
          />
          <StyledTextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </div>
       </div>
      </StyledPaper>
    </ThemeProvider>
  );
};

export default Filters;
