import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { styled } from "@mui/system";
import theme from "./styles/theme";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import { WalletProvider } from "./contexts/WalletContext";
import "./index.scss";

const NFT_CONTRACT_ADDRESS = "YOUR_NFT_CONTRACT_ADDRESS";
const MARKETPLACE_CONTRACT_ADDRESS = "YOUR_MARKETPLACE_CONTRACT_ADDRESS";

const AppContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
}));

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
                <Route path="/create" element={<Create />} />
                <Route path="/profile" element={<Profile />} />
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
