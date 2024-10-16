import React, { useState, useEffect, useContext } from "react";
import NFTCard from "../components/NFTCard";
import { NFT } from "../types";
import { WalletContext } from "../contexts/WalletContext";
import "../styles/pages/_explore.scss";

const Explore: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, nftService } = context;

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const fetchedCollections = await nftService.getAllCollections();
        const fetchedNFTs: NFT[] = [];
        for (const collectionAddress of fetchedCollections) {
          const collectionNFTs = await nftService.getNFTsForCollection(
            collectionAddress
          );
          fetchedNFTs.push(...collectionNFTs);
        }
        setNfts(fetchedNFTs);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      }
    };

    fetchNFTs();
  }, [nftService]);

  const handleBuy = async (nft: NFT) => {
    // Implémentez la logique d'achat ici
    console.log("Achat du NFT", nft);
  };

  const handleList = async (nft: NFT, price: string) => {
    // Implémentez la logique de mise en vente ici
    console.log("Mise en vente du NFT", nft, "pour", price);
  };

  return (
    <div className="explore">
      <h1 className="explore__title">Explorer les NFTs</h1>
      <div className="explore__grid">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            onBuy={() => handleBuy(nft)}
            onList={(price) => handleList(nft, price)}
            isOwner={address === nft.owner}
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;
