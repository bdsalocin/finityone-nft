import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NFTCard from "../components/NFTCard";
import { NFT } from "../types";

const Explore: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch NFTs from your API or blockchain
    // This is a placeholder. Replace with actual data fetching logic
    const fetchNFTs = async () => {
      const mockNFTs: NFT[] = [
        {
          id: "1",
          name: "Cool NFT 1",
          description: "This is a cool NFT",
          image: "https://via.placeholder.com/300",
          price: "0.1",
        },
        {
          id: "2",
          name: "Awesome NFT 2",
          description: "This is an awesome NFT",
          image: "https://via.placeholder.com/300",
          price: "0.2",
        },
        {
          id: "3",
          name: "Unique NFT 3",
          description: "This is a unique NFT",
          image: "https://via.placeholder.com/300",
          price: "0.3",
        },
      ];
      setNfts(mockNFTs);
    };

    fetchNFTs();
  }, []);

  const filteredNFTs = nfts.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Explore NFTs
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search NFTs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={4}>
        {filteredNFTs.map((nft) => (
          <Grid item key={nft.id} xs={12} sm={6} md={4}>
            <NFTCard nft={nft} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Explore;
