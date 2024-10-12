import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import { styled } from "@mui/system";

const StyledFooter = styled(Box)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0),
    marginTop: "auto",
  })
);

const Footer: React.FC = () => {
  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} NFT Platform. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Powered by{" "}
          <Link color="inherit" href="https://onefinity.network/">
            ONEFINITY
          </Link>
        </Typography>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
