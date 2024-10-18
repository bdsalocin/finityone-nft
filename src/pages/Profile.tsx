import React, { useState, useEffect, useContext } from "react";
import {
  FaEdit,
  FaCopy,
  FaTwitter,
  FaInstagram,
  FaGlobe,
  FaChartLine,
  FaExchangeAlt,
} from "react-icons/fa";
import { WalletContext } from "../contexts/WalletContext";
import NFTGallery from "../components/NFTGallery";
import { OnefinityNFTService } from "../services/OnefinityNFTService";
import { NFT } from "../types";
import "../styles/pages/_profile.scss";

const Profile: React.FC = () => {
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState("collected");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    bio: "",
    twitter: "",
    instagram: "",
    website: "",
  });
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, balance, connectWallet, nftService } = context;

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address]);

  const fetchUserData = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const nfts = await nftService.getUserNFTs(address);
      setUserNFTs(nfts);
      // In a real application, you would fetch the user profile from a database here
      setUserProfile({
        username: `User_${address.substring(2, 6)}`,
        bio: "",
        twitter: "",
        instagram: "",
        website: "",
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    // In a real application, you would save the profile to a database here
    console.log("Profile saved:", userProfile);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert("Address copied to clipboard!");
    }
  };

  const handleBuyNFT = async (nft: NFT) => {
    try {
      await nftService.buyNFT(parseInt(nft.id), nft.price);
      alert(`Successfully purchased ${nft.name}!`);
      fetchUserData(); // Refresh user NFTs after purchase
    } catch (err) {
      console.error("Failed to buy NFT:", err);
      alert("Failed to buy NFT. Please try again.");
    }
  };

  const handleListNFT = async (nft: NFT) => {
    const price = prompt(`Enter the price for ${nft.name} in ONE:`);
    if (price) {
      try {
        await nftService.listNFT(parseInt(nft.id), price);
        alert(`NFT ${nft.name} listed for ${price} ONE`);
        fetchUserData(); // Refresh user NFTs after listing
      } catch (err) {
        console.error("Failed to list NFT:", err);
        alert("Failed to list NFT. Please try again.");
      }
    }
  };

  const handleCancelListing = async (nft: NFT) => {
    try {
      await nftService.cancelListing(parseInt(nft.id));
      alert(`Listing cancelled for NFT ${nft.name}`);
      fetchUserData(); // Refresh user NFTs after cancelling listing
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      alert("Failed to cancel listing. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  if (!address) {
    return (
      <div className="profile profile--not-connected">
        <h1>Connect your wallet to view your profile</h1>
        <button onClick={connectWallet} className="btn btn--primary">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="profile__loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile__error">{error}</div>;
  }

  return (
    <div className="profile">
      <div className="profile__cover">
        <div className="profile__header">
          <div className="profile__avatar-container">
            <img
              src={`https://robohash.org/${address}`}
              alt="User Avatar"
              className="profile__avatar"
            />
            <button
              className="profile__edit-avatar"
              onClick={handleEditProfile}
            >
              <FaEdit />
            </button>
          </div>
          <div className="profile__info">
            <div className="profile__main-info">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={userProfile.username}
                  onChange={handleInputChange}
                  className="profile__username-input"
                />
              ) : (
                <h1 className="profile__username">{userProfile.username}</h1>
              )}
              <p className="profile__address">
                {`${address.substr(0, 6)}...${address.substr(-4)}`}
                <button onClick={copyAddress} className="profile__copy-address">
                  <FaCopy />
                </button>
              </p>
              <p className="profile__balance">Balance: {balance} ONE</p>
            </div>
            <div className="profile__bio-container">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userProfile.bio}
                  onChange={handleInputChange}
                  className="profile__bio-input"
                  placeholder="Enter your bio..."
                />
              ) : (
                <p className="profile__bio">
                  {userProfile.bio || "No bio yet"}
                </p>
              )}
            </div>
            <div className="profile__social">
              <a
                href={userProfile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="profile__social-link"
              >
                <FaTwitter />
              </a>
              <a
                href={userProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="profile__social-link"
              >
                <FaInstagram />
              </a>
              <a
                href={userProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="profile__social-link"
              >
                <FaGlobe />
              </a>
            </div>
          </div>
        </div>
        <div className="profile__actions">
          {isEditing ? (
            <button onClick={handleSaveProfile} className="btn btn--primary">
              Save Profile
            </button>
          ) : (
            <button onClick={handleEditProfile} className="btn btn--secondary">
              Edit Profile
            </button>
          )}
          <button onClick={toggleStats} className="btn btn--tertiary">
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        </div>
      </div>

      {showStats && (
        <div className="profile__stats">
          <div className="profile__stat">
            <FaChartLine />
            <span>Total Value: $10,000</span>
          </div>
          <div className="profile__stat">
            <FaExchangeAlt />
            <span>30 Day Volume: $5,000</span>
          </div>
        </div>
      )}

      <div className="profile__tabs">
        <button
          className={`profile__tab ${
            activeTab === "collected" ? "active" : ""
          }`}
          onClick={() => setActiveTab("collected")}
        >
          Collected
        </button>
        <button
          className={`profile__tab ${activeTab === "created" ? "active" : ""}`}
          onClick={() => setActiveTab("created")}
        >
          Created
        </button>
        <button
          className={`profile__tab ${activeTab === "listed" ? "active" : ""}`}
          onClick={() => setActiveTab("listed")}
        >
          Listed
        </button>
      </div>

      <div className="profile__content">
        <NFTGallery
          nfts={userNFTs.filter((nft) => {
            if (activeTab === "collected") return nft.owner === address;
            if (activeTab === "created") return nft.creator === address;
            if (activeTab === "listed") return nft.isListed;
            return false;
          })}
          onBuy={handleBuyNFT}
          onList={handleListNFT}
          onCancelListing={handleCancelListing}
          isOwner={(nft: NFT) => nft.owner === address}
        />
      </div>
    </div>
  );
};

export default Profile;
