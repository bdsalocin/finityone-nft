import React from "react";
import { NFT } from "../types";
import NFTCard from "./NFTCard";

interface NFTGalleryProps {
  nfts: NFT[];
  onBuy: (nft: NFT) => void;
  onList: (nft: NFT) => void;
  isOwner: (nft: NFT) => boolean;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({
  nfts,
  onBuy,
  onList,
  isOwner,
}) => {
  return (
    <div className="nft-gallery">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          onBuy={() => onBuy(nft)}
          onList={() => onList(nft)}
          isOwner={isOwner(nft)}
        />
      ))}
    </div>
  );
};

export default NFTGallery;
