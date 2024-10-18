import React, { useState, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import "../styles/pages/_create.scss";
import { NewNFTMetadata } from "../types";

const CreateCollection: React.FC = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { nftService } = context;
  const [collectionName, setCollectionName] = useState("");
  const [newNFTMetadata, setNewNFTMetadata] = useState<NewNFTMetadata>({
    name: "",
    description: "",
    image: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // En pratique, vous devriez d'abord uploader l'image sur IPFS et obtenir son URI
      const tokenURI = JSON.stringify(newNFTMetadata);
      await nftService.mintNFT(tokenURI);
      setSuccess(`NFT "${newNFTMetadata.name}" minted successfully!`);
      setNewNFTMetadata({ name: "", description: "", image: "" });
    } catch (err: any) {
      setError(err.message || "An error occurred while minting the NFT");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNFTMetadata((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="create">
      <h1 className="create__title">Create NFT Collection</h1>
      <form className="create__form" onSubmit={handleSubmit}>
        <div className="create__form-group">
          <label htmlFor="collectionName">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
          />
        </div>
        <div className="create__form-group">
          <label htmlFor="name">NFT Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newNFTMetadata.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="create__form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={newNFTMetadata.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="create__form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={newNFTMetadata.image}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="create__submit">
          Create NFT
        </button>
      </form>
      {success && <p className="create__success">{success}</p>}
      {error && <p className="create__error">{error}</p>}
    </div>
  );
};

export default CreateCollection;
