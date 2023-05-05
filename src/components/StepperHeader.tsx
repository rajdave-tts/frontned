import React, { ReactNode } from "react";
import Fab from "@mui/material/Fab";
import { Box } from "@mui/material";
interface StepperHeaderProps {
  children: ReactNode;
}
export const StepperHeader = (props: StepperHeaderProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 45,
        borderRadius: 1.5,
        padding: "8px 16px",
        margin: "12px 0",
        fontSize: 20,
        color: "white",
        backgroundColor: "rgb(96, 26, 121)",
      }}
    >
      {props.children}
    </Box>
  );
};
