import React, { createContext, useState, useEffect, ReactNode } from "react";
import MetamaskServices from "../services/MetamaskServices";
import OnefinityNFTService from "../services/OnefinityNFTService";

interface WalletContextType {
  address: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  nftService: OnefinityNFTService;
  error: string | null;
}

export const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
  nftContractAddress: string;
  marketplaceContractAddress: string;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  nftContractAddress,
  marketplaceContractAddress,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nftService] = useState(() => new OnefinityNFTService());

  const connectWallet = async () => {
    try {
      setError(null);
      const connectedAddress = await MetamaskServices.connect();
      setAddress(connectedAddress);
      const fetchedBalance = await MetamaskServices.getBalance(
        connectedAddress
      );
      setBalance(fetchedBalance);
      await nftService.init(nftContractAddress, marketplaceContractAddress);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectedAddress = await MetamaskServices.connect();
        if (connectedAddress) {
          setAddress(connectedAddress);
          const fetchedBalance = await MetamaskServices.getBalance(
            connectedAddress
          );
          setBalance(fetchedBalance);
          await nftService.init(nftContractAddress, marketplaceContractAddress);
        }
      } catch (error: any) {
        console.error("Error checking connection:", error);
        setError(error.message || "Error checking wallet connection");
      }
    };

    checkConnection();
  }, [nftContractAddress, marketplaceContractAddress]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          connectWallet(); // Refresh balance and reinitialize nftService
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        connectWallet,
        disconnectWallet,
        nftService,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
