import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Plus,
  UserPlus,
  Sparkles,
  Rocket,
  Image,
  RefreshCw,
} from "lucide-react";
import { WalletContext } from "../contexts/WalletContext";
import NFTCard from "../components/NFTCard";
import { NFT } from "../types";

const Home: React.FC = () => {
  const [topCollections] = useState([
    {
      id: 1,
      name: "CryptoPunks",
      floorPrice: 5.5,
      volume: 1000,
      change: 2.5,
    },
    {
      id: 2,
      name: "Bored Ape Yacht Club",
      floorPrice: 18.2,
      volume: 2500,
      change: -1.8,
    },
    {
      id: 3,
      name: "Azuki",
      floorPrice: 3.1,
      volume: 750,
      change: 5.2,
    },
    {
      id: 4,
      name: "Doodles",
      floorPrice: 2.4,
      volume: 500,
      change: -0.5,
    },
    {
      id: 5,
      name: "CloneX",
      floorPrice: 4.8,
      volume: 1200,
      change: 3.7,
    },
  ]);

  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(WalletContext);

  const stats = [
    { value: "10K+", label: "Artworks", icon: Image },
    { value: "5K+", label: "Collections", icon: Rocket },
    { value: "$2M+", label: "Volume", icon: RefreshCw },
  ];

  useEffect(() => {
    // Simulation du chargement des NFTs
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__hero-title">
            Discover and Collect
            <br />
            Extraordinary NFTs
          </h1>
          <p className="home__hero-subtitle">
            The leading NFT marketplace on OneFinity Network with the best
            prices & unique collections
          </p>
          <div className="home__hero-stats">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="home__hero-stat">
                  <Icon className="home__hero-stat-icon" />
                  <div className="home__hero-stat-value">{stat.value}</div>
                  <div className="home__hero-stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="home__top-collections">
        <h2 className="home__section-title">
          <TrendingUp />
          Top Collections
        </h2>
        <div className="home__table-container">
          <table className="home__table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Floor Price</th>
                <th>Volume</th>
                <th>24h %</th>
              </tr>
            </thead>
            <tbody>
              {topCollections.map((collection) => (
                <tr key={collection.id}>
                  <td>
                    <span className="home__collection-rank">
                      {collection.id}
                    </span>
                    <span className="home__collection-name">
                      {collection.name}
                    </span>
                  </td>
                  <td>{collection.floorPrice} ONE</td>
                  <td>{collection.volume.toLocaleString()} ONE</td>
                  <td>
                    <span
                      className={`home__change ${
                        collection.change > 0
                          ? "home__change--positive"
                          : "home__change--negative"
                      }`}
                    >
                      {collection.change > 0 ? <ChevronUp /> : <ChevronDown />}
                      {Math.abs(collection.change)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/collections" className="home__view-all">
          View All Collections
        </Link>
      </section>

      <section className="home__create-cta">
        <h2 className="home__create-title">Create your unique Collection</h2>
        <p className="home__create-subtitle">
          Turn your creativity into unique NFTs. Start your journey in the NFT
          world by creating your own extraordinary collection on the OneFinity
          Network.
        </p>
        <Link to="/create" className="home__create-button">
          <Plus />
          Start Creating
        </Link>
      </section>
      <section className="home__join-cta">
        <h2 className="home__join-title">
          <span>Join the OneFinity Community</span>
        </h2>
        <p className="home__join-subtitle">
          Connect with thousands of artists, collectors, and enthusiasts. Be
          part of the next generation of digital art and innovation.
        </p>
        <Link to="/signup" className="home__join-button">
          <UserPlus />
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
