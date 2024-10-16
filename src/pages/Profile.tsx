import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import NFTGallery from "../components/NFTGallery";
import { FaEdit, FaCopy, FaTwitter, FaInstagram } from "react-icons/fa";
import "../styles/pages/_profile.scss";
import { NFT } from "../types";

const Profile: React.FC = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, connectWallet, nftService } = context;
  const [balance, setBalance] = useState<string | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState("collected");

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        const bal = await nftService.getBalance(address);
        setBalance(bal);
        // Fetch user's NFTs
        const nfts = await nftService.getUserNFTs(address);
        setUserNFTs(nfts);
      }
    };

    fetchData();
  }, [address, nftService]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You can add a toast notification here
    }
  };

  if (!address) {
    return (
      <div className="profile profile--not-connected">
        <h1 className="profile__title">Welcome to Your Profile</h1>
        <p className="profile__subtitle">
          Connect your wallet to view your profile
        </p>
        <button onClick={connectWallet} className="btn btn--primary btn--large">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__cover">
          <button className="profile__edit-cover">
            <FaEdit /> Edit Cover
          </button>
        </div>
        <div className="profile__avatar-container">
          <img
            src={`https://robohash.org/${address}`}
            alt="User Avatar"
            className="profile__avatar"
          />
          <button className="profile__edit-avatar">
            <FaEdit />
          </button>
        </div>
      </div>

      <div className="profile__info">
        <h1 className="profile__name">
          User_{address.substring(2, 8)}
          <button className="profile__edit-name">
            <FaEdit />
          </button>
        </h1>
        <p className="profile__address">
          {`${address.substring(0, 6)}...${address.substring(
            address.length - 4
          )}`}
          <button onClick={copyAddress} className="profile__copy-address">
            <FaCopy />
          </button>
        </p>
        <p className="profile__balance">Balance: {balance} ONE</p>
        <div className="profile__social">
          <a href="#" className="profile__social-link">
            <FaTwitter />
          </a>
          <a href="#" className="profile__social-link">
            <FaInstagram />
          </a>
        </div>
        <p className="profile__bio">
          NFT enthusiast and collector on FinityONE
          <button className="profile__edit-bio">
            <FaEdit />
          </button>
        </p>
      </div>

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
          className={`profile__tab ${
            activeTab === "favorited" ? "active" : ""
          }`}
          onClick={() => setActiveTab("favorited")}
        >
          Favorited
        </button>
        <button
          className={`profile__tab ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
      </div>

      <div className="profile__content">
        {activeTab === "collected" && (
          <NFTGallery
            nfts={userNFTs.filter((nft) => nft.type === "collected")}
          />
        )}
        {activeTab === "created" && (
          <NFTGallery nfts={userNFTs.filter((nft) => nft.type === "created")} />
        )}
        {activeTab === "favorited" && (
          <NFTGallery
            nfts={userNFTs.filter((nft) => nft.type === "favorited")}
          />
        )}
        {activeTab === "activity" && (
          <div className="profile__activity">
            <h2>Recent Activity</h2>
            {/* Add activity items here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
