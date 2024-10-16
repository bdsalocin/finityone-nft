import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { WalletContext } from "../contexts/WalletContext";
import NFTCard from "../components/NFTCard";
import "../styles/pages/_home.scss";

const Home: React.FC = () => {
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, connectWallet, nftService } = context;

  useEffect(() => {
    if (address) {
      fetchCollections();
    }
  }, [address]);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCollections = await nftService.getAllCollections();
      setCollections(fetchedCollections);
      if (fetchedCollections.length > 0) {
        setSelectedCollection(fetchedCollections[0]);
        await fetchNFTs(fetchedCollections[0]);
      }
    } catch (err) {
      console.error("Failed to fetch collections:", err);
      setError("Failed to fetch collections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNFTs = async (collectionAddress: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNFTs = await nftService.getNFTsForCollection(
        collectionAddress
      );
      setNfts(fetchedNFTs);
      setSelectedCollection(collectionAddress);
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
      setError("Failed to fetch NFTs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId: string, price: string) => {
    if (!selectedCollection) return;
    setError(null);
    try {
      await nftService.buyNFT(selectedCollection, tokenId, price);
      await fetchNFTs(selectedCollection);
    } catch (err) {
      console.error("Failed to buy NFT:", err);
      setError("Failed to buy NFT. Please try again.");
    }
  };

  const handleList = async (tokenId: string, price: string) => {
    if (!selectedCollection) return;
    setError(null);
    try {
      await nftService.listNFT(selectedCollection, tokenId, price);
      await fetchNFTs(selectedCollection);
    } catch (err) {
      console.error("Failed to list NFT:", err);
      setError("Failed to list NFT. Please try again.");
    }
  };

  return (
    <div className="home">
      <h1 className="home__title">Onefinity NFT Marketplace</h1>

      {!address ? (
        <div className="home__connect">
          <p>Connect your wallet to interact with the NFT marketplace.</p>
          <button onClick={connectWallet} className="btn btn--primary">
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <section className="home__collections">
            <h2>NFT Collections</h2>
            {collections.length > 0 ? (
              <div className="home__collections-list">
                {collections.map((collection) => (
                  <button
                    key={collection}
                    onClick={() => fetchNFTs(collection)}
                    className={`btn ${
                      selectedCollection === collection ? "btn--active" : ""
                    }`}
                  >
                    {collection.substring(0, 6)}...
                    {collection.substring(collection.length - 4)}
                  </button>
                ))}
              </div>
            ) : (
              <p>No collections found. Create your first collection!</p>
            )}
          </section>

          {selectedCollection && (
            <section className="home__nfts">
              <h2>NFTs in Selected Collection</h2>
              {loading && <p>Loading NFTs...</p>}
              {error && <p className="home__error">{error}</p>}
              {nfts.length > 0 ? (
                <div className="home__nfts-grid">
                  {nfts.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      onBuy={() => handleBuy(nft.id, nft.price)}
                      onList={(price) => handleList(nft.id, price)}
                      isOwner={address === nft.owner}
                    />
                  ))}
                </div>
              ) : (
                <p>No NFTs found in this collection.</p>
              )}
            </section>
          )}

          <div className="home__actions">
            <Link to="/create" className="btn btn--secondary">
              Create New Collection or NFT
            </Link>
            <Link to="/explore" className="btn btn--secondary">
              Explore All NFTs
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
