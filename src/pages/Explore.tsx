import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import NFTCard from "../components/NFTCard";
import { NFT } from "../types";
import { WalletContext } from "../contexts/WalletContext";
import { OnefinityNFTService } from "../services/OnefinityNFTService";
import "../styles/pages/_explore.scss";

const Explore: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, nftService } = context as {
    address: string | null;
    nftService: OnefinityNFTService;
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    filterNFTs();
  }, [searchTerm, selectedCategory, priceRange, nfts]);

  const fetchNFTs = async () => {
    setLoading(true);
    setError(null);
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
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
      setError("Failed to fetch NFTs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterNFTs = () => {
    let filtered = nfts;

    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((nft) => nft.type === selectedCategory);
    }

    filtered = filtered.filter(
      (nft) =>
        parseFloat(nft.price) >= priceRange.min &&
        parseFloat(nft.price) <= priceRange.max
    );

    setFilteredNfts(filtered);
  };

  const handleList = async (nft: NFT, price: string) => {
    try {
      await nftService.listNFT(parseInt(nft.id), price);
      alert(`Successfully listed ${nft.name} for ${price} ONE!`);
      fetchNFTs(); // Refresh NFTs after listing
    } catch (err) {
      console.error("Failed to list NFT:", err);
      alert("Failed to list NFT. Please try again.");
    }
  };

  const handleBuy = async (nft: NFT) => {
    if (!address) {
      alert("Please connect your wallet to buy NFTs");
      return;
    }

    try {
      await nftService.buyNFT(parseInt(nft.id), nft.price);
      alert(`Successfully purchased ${nft.name}!`);
      fetchNFTs(); // Refresh NFTs after purchase
    } catch (err) {
      console.error("Failed to buy NFT:", err);
      alert("Failed to buy NFT. Please try again.");
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="explore">
      <h1 className="explore__title">Explore NFTs</h1>
      <div className="explore__search-filter">
        <div className="explore__search">
          <FaSearch className="explore__search-icon" />
          <input
            type="text"
            placeholder="Search NFTs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="explore__filter-toggle" onClick={toggleFilters}>
          <FaFilter /> Filters
        </button>
      </div>
      {showFilters && (
        <div className="explore__filters">
          <div className="explore__filter">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="art">Art</option>
              <option value="collectibles">Collectibles</option>
              <option value="music">Music</option>
              <option value="photography">Photography</option>
            </select>
          </div>
          <div className="explore__filter">
            <label>Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
      )}
      {loading && <p className="explore__loading">Loading NFTs...</p>}
      {error && <p className="explore__error">{error}</p>}
      <div className="explore__grid">
        {filteredNfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            onBuy={() => handleBuy(nft)}
            onList={(price) => handleList(nft, price)}
            onCancelListing={() => {
              /* Implement cancel listing logic */
            }}
            isOwner={address === nft.owner}
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;
