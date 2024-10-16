import React, { useState, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import "../styles/pages/_createCollection.scss";

const CreateCollection: React.FC = () => {
  const { nftService, address } = useContext(WalletContext)!;
  const [collectionName, setCollectionName] = useState("");
  const [newNFTMetadata, setNewNFTMetadata] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      // Ici, vous devriez avoir une méthode pour créer une nouvelle collection
      // Cette méthode n'existe pas encore dans notre service, donc c'est un placeholder
      // await nftService.createCollection(collectionName);
      setSuccess(`Collection "${collectionName}" created successfully!`);
      setCollectionName("");
    } catch (err: any) {
      setError(err.message || "Failed to create collection");
    }
  };

  const handleMintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      // En pratique, vous devriez d'abord uploader l'image sur IPFS et obtenir son URI
      const tokenURI = JSON.stringify(newNFTMetadata);
      await nftService.mintNFT(collectionName, tokenURI);
      setSuccess(`NFT "${newNFTMetadata.name}" minted successfully!`);
      setNewNFTMetadata({ name: "", description: "", image: "" });
    } catch (err: any) {
      setError(err.message || "Failed to mint NFT");
    }
  };

  if (!address) {
    return (
      <div className="create-collection">
        Please connect your wallet to create a collection or mint NFTs.
      </div>
    );
  }

  return (
    <div className="create-collection">
      <h1>Create Collection and Mint NFT</h1>

      <form
        onSubmit={handleCreateCollection}
        className="create-collection__form"
      >
        <h2>Create New Collection</h2>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          placeholder="Collection Name"
          required
        />
        <button type="submit">Create Collection</button>
      </form>

      <form onSubmit={handleMintNFT} className="create-collection__form">
        <h2>Mint New NFT</h2>
        <input
          type="text"
          value={newNFTMetadata.name}
          onChange={(e) =>
            setNewNFTMetadata({ ...newNFTMetadata, name: e.target.value })
          }
          placeholder="NFT Name"
          required
        />
        <textarea
          value={newNFTMetadata.description}
          onChange={(e) =>
            setNewNFTMetadata({
              ...newNFTMetadata,
              description: e.target.value,
            })
          }
          placeholder="NFT Description"
          required
        />
        <input
          type="text"
          value={newNFTMetadata.image}
          onChange={(e) =>
            setNewNFTMetadata({ ...newNFTMetadata, image: e.target.value })
          }
          placeholder="Image URL"
          required
        />
        <button type="submit">Mint NFT</button>
      </form>

      {error && <p className="create-collection__error">{error}</p>}
      {success && <p className="create-collection__success">{success}</p>}
    </div>
  );
};

export default CreateCollection;
