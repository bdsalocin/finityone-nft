import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { styled } from "@mui/system";
import theme from "./styles/theme";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CreateCollection from "./pages/CreateCollection";
import Profile from "./pages/Profile";
import { WalletProvider } from "./contexts/WalletContext";
import "./index.scss";

const AppContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
}));

const NFT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const MARKETPLACE_CONTRACT_ADDRESS =
  "0x0987654321098765432109876543210987654321";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletProvider
        nftContractAddress={NFT_CONTRACT_ADDRESS}
        marketplaceContractAddress={MARKETPLACE_CONTRACT_ADDRESS}
      >
        <Router>
          <AppContainer>
            <Header />
            <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/create" element={<CreateCollection />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateCollection />} />
              </Routes>
            </Container>
            <Footer />
          </AppContainer>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default App;
