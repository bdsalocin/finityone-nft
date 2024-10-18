import React, { useState } from "react";
import { NFT } from "../types";

export interface NFTCardProps {
  nft: NFT;
  onBuy: () => void;
  onList: (price: string) => void;
  onCancelListing: () => void;
  isOwner: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onBuy,
  onList,
  onCancelListing,
  isOwner,
}) => {
  const [listPrice, setListPrice] = useState("");

  return (
    <div className="nft-card">
      <img src={nft.image} alt={nft.name} className="nft-card__image" />
      <div className="nft-card__content">
        <h3 className="nft-card__title">{nft.name}</h3>
        <p className="nft-card__description">{nft.description}</p>
        <p className="nft-card__owner">Owner: {nft.owner}</p>
        {nft.price !== "0" ? (
          <>
            <p className="nft-card__price">Price: {nft.price} ONE</p>
            {isOwner ? (
              <button
                onClick={onCancelListing}
                className="nft-card__cancel-button"
              >
                Cancel Listing
              </button>
            ) : (
              <button onClick={onBuy} className="nft-card__buy-button">
                Buy
              </button>
            )}
          </>
        ) : (
          isOwner && (
            <div className="nft-card__list">
              <input
                type="text"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="Price in ONE"
                className="nft-card__list-input"
              />
              <button
                onClick={() => onList(listPrice)}
                className="nft-card__list-button"
              >
                List for Sale
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NFTCard;
