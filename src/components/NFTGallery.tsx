import React from "react";
import { NFT } from "../types";
import NFTCard, { NFTCardProps } from "./NFTCard";

export interface NFTGalleryProps {
  nfts: NFT[];
  onBuy: (nft: NFT) => void;
  onList: (nft: NFT) => void;
  onCancelListing: (nft: NFT) => void;
  isOwner: (nft: NFT) => boolean;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({
  nfts,
  onBuy,
  onList,
  onCancelListing,
  isOwner,
}) => {
  return (
    <div className="nft-gallery">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          onBuy={() => onBuy(nft)}
          onList={(price) => onList({ ...nft, price })}
          onCancelListing={() => onCancelListing(nft)}
          isOwner={isOwner(nft)}
        />
      ))}
    </div>
  );
};

export default NFTGallery;
