import React, { useState, useContext } from "react";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { WalletContext } from "../contexts/WalletContext";
import { OnefinityNFTService } from "../services/OnefinityNFTService";
import "../styles/pages/_create.scss";

const Create: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    royalty: "",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { nftService } = context as { nftService: OnefinityNFTService };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!file) throw new Error("Please select a file to upload");

      // Here you would typically upload the file to IPFS or your preferred storage solution
      // and get back the file URL. For this example, we'll use a placeholder URL.
      const fileUrl = "https://example.com/placeholder-nft-image.jpg";

      const tokenURI = JSON.stringify({
        name: formData.name,
        description: formData.description,
        image: fileUrl,
        attributes: [
          { trait_type: "Category", value: formData.category },
          { trait_type: "Price", value: formData.price },
          { trait_type: "Royalty", value: formData.royalty },
        ],
      });

      await nftService.mintNFT(tokenURI);
      setSuccess("NFT created successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        royalty: "",
        category: "",
      });
      setFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the NFT");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="create">
      <h1 className="create__title">Create New NFT</h1>
      <form className="create__form" onSubmit={handleSubmit}>
        <div className="create__upload">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="NFT Preview"
              className="create__preview"
            />
          ) : (
            <div className="create__upload-placeholder">
              <FaUpload />
              <p>Upload your file here</p>
            </div>
          )}
          <input
            type="file"
            id="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
            className="create__file-input"
          />
          <label htmlFor="file" className="create__file-label">
            Choose File
          </label>
        </div>

        <div className="create__form-group">
          <label htmlFor="name" className="create__label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="create__input"
            required
          />
        </div>

        <div className="create__form-group">
          <label htmlFor="description" className="create__label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="create__textarea"
            required
          />
        </div>

        <div className="create__form-group">
          <label htmlFor="price" className="create__label">
            Price (ONE)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="create__input"
            min="0"
            step="0.000000000000000001"
            required
          />
        </div>

        <div className="create__form-group">
          <label htmlFor="royalty" className="create__label">
            Royalty (%)
          </label>
          <input
            type="number"
            id="royalty"
            name="royalty"
            value={formData.royalty}
            onChange={handleChange}
            className="create__input"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="create__form-group">
          <label htmlFor="category" className="create__label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="create__select"
            required
          >
            <option value="">Select a category</option>
            <option value="art">Art</option>
            <option value="collectibles">Collectibles</option>
            <option value="music">Music</option>
            <option value="photography">Photography</option>
            <option value="sports">Sports</option>
            <option value="trading-cards">Trading Cards</option>
            <option value="utility">Utility</option>
            <option value="virtual-worlds">Virtual Worlds</option>
          </select>
        </div>

        <button
          type="submit"
          className="create__submit btn btn--primary btn--large"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="create__spinner" /> Creating...
            </>
          ) : (
            "Create NFT"
          )}
        </button>
      </form>

      {error && <p className="create__error">{error}</p>}
      {success && <p className="create__success">{success}</p>}
    </div>
  );
};

export default Create;
