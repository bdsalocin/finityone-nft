import React, { createContext, useState, useEffect, ReactNode } from "react";
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
  const [nftService] = useState(
    () =>
      new OnefinityNFTService(nftContractAddress, marketplaceContractAddress)
  );

  const connectWallet = async () => {
    try {
      setError(null);
      const connectedAddress = await nftService.connect();
      setAddress(connectedAddress);
      const fetchedBalance = await nftService.getBalance(connectedAddress);
      setBalance(fetchedBalance);
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
      if (nftService.isConnected()) {
        try {
          const connectedAddress = await nftService.getConnectedAddress();
          if (connectedAddress) {
            setAddress(connectedAddress);
            const fetchedBalance = await nftService.getBalance(
              connectedAddress
            );
            setBalance(fetchedBalance);
          }
        } catch (error: any) {
          console.error("Error checking connection:", error);
          setError(error.message || "Error checking wallet connection");
        }
      }
    };

    checkConnection();
  }, [nftService]);

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
