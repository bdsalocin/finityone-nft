import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronUp, FaChevronDown, FaFire } from "react-icons/fa";
import { WalletContext } from "../contexts/WalletContext";
import NFTCard from "../components/NFTCard";
import { NFT } from "../types";
import "../styles/pages/_home.scss";

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topCollections, setTopCollections] = useState<any[]>([]);

  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, connectWallet, nftService } = context;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    fetchNFTs();
    fetchTopCollections();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const fetchTopCollections = async () => {
    // This is a mock implementation. In a real-world scenario, you would fetch this data from your backend or blockchain
    const mockTopCollections = [
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
      { id: 3, name: "Azuki", floorPrice: 3.1, volume: 750, change: 5.2 },
      { id: 4, name: "Doodles", floorPrice: 2.4, volume: 500, change: -0.5 },
      { id: 5, name: "CloneX", floorPrice: 4.8, volume: 1200, change: 3.7 },
    ];
    setTopCollections(mockTopCollections);
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

  const handleList = async (nft: NFT, price: string) => {
    if (!address) {
      alert("Please connect your wallet to list NFTs");
      return;
    }

    try {
      await nftService.listNFT(parseInt(nft.id), price);
      alert(`Successfully listed ${nft.name} for ${price} ONE!`);
      fetchNFTs(); // Refresh NFTs after listing
    } catch (err) {
      console.error("Failed to list NFT:", err);
      alert("Failed to list NFT. Please try again.");
    }
  };

  const handleCancelListing = async (nft: NFT) => {
    if (!address) {
      alert("Please connect your wallet to cancel listings");
      return;
    }

    try {
      await nftService.cancelListing(parseInt(nft.id));
      alert(`Successfully cancelled listing for ${nft.name}!`);
      fetchNFTs(); // Refresh NFTs after cancelling listing
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      alert("Failed to cancel listing. Please try again.");
    }
  };

  return (
    <div className="home">
      <section className="home__top-collections">
        <h2 className="home__section-title">Today's Top Collections</h2>
        <div className="home__table-container">
          <table className="home__table">
            <thead>
              <tr>
                <th>Collection</th>
                {!isMobile && <th>Floor Price</th>}
                <th>Volume</th>
                <th>24h %</th>
              </tr>
            </thead>
            <tbody>
              {topCollections.map((collection) => (
                <tr key={collection.id}>
                  <td>
                    {!isMobile && (
                      <span className="home__collection-rank">
                        {collection.id}
                      </span>
                    )}
                    <span className="home__collection-name">
                      {collection.name}
                    </span>
                  </td>
                  {!isMobile && <td>{collection.floorPrice} ONE</td>}
                  <td>{collection.volume} ONE</td>
                  <td
                    className={`home__change ${
                      collection.change > 0
                        ? "home__change--positive"
                        : "home__change--negative"
                    }`}
                  >
                    {collection.change > 0 ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                    {Math.abs(collection.change)}%
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

      <section className="home__nft-marketplace">
        <h2 className="home__section-title">NFT Marketplace</h2>
        {!address ? (
          <button onClick={connectWallet} className="btn btn--primary">
            Connect Wallet
          </button>
        ) : (
          <>
            {loading && <p className="home__loading">Loading NFTs...</p>}
            {error && <p className="home__error">{error}</p>}
            <div className="home__nfts-grid">
              {nfts.map((nft) => (
                <NFTCard
                  key={`${nft.collectionAddress}-${nft.id}`}
                  nft={nft}
                  onBuy={() => handleBuy(nft)}
                  onList={(price) => handleList(nft, price)}
                  onCancelListing={() => handleCancelListing(nft)}
                  isOwner={address === nft.owner}
                />
              ))}
            </div>
            {!loading && nfts.length === 0 && (
              <p className="home__no-nfts">No NFTs available at the moment.</p>
            )}
          </>
        )}
      </section>

      <section className="home__create-cta">
        <h2 className="home__create-title">Create your unique Collection</h2>
        <p className="home__create-subtitle">
          Create your unique NFT collection on FinityONE: unleash your
          creativity now
        </p>
        <Link to="/create" className="home__create-button">
          Create Now
        </Link>
      </section>

      <section className="home__join-cta">
        <h2 className="home__join-title">
          Join thousands of people using FinityONE
        </h2>
        <p className="home__join-subtitle">
          Start exploring events and trading digital collectibles right away
        </p>
        <Link to="/signup" className="home__join-button">
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
