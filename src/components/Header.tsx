import Logo from "../assets/credilinq-logo.svg";
import { Box, Container, Grid } from "@mui/material";
import React from "react";
const Header = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 145,
      }}
      style={{
        background: "linear-gradient(to right,blue,purple)",
      }}
    >
      <Grid container spacing={2} minHeight={160}>
        <Grid
          item
          xs
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img src="../assets/credilinq-logo.svg" />
        </Grid>
        <Grid
          item
          xs
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div
            style={{
              fontSize: "28px",
              color: "white",
            }}
          >
            SME HealthCheck - Get Started
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
