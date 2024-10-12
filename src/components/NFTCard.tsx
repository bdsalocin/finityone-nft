import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { NFT } from "../types";

interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="200"
        image={nft.image}
        alt={nft.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {nft.name}
        </Typography>
        <Typography>{nft.description}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Price: {nft.price} ONE
        </Typography>
      </CardContent>
      <Button size="small" color="primary" sx={{ m: 2 }}>
        View Details
      </Button>
    </Card>
  );
};

export default NFTCard;
