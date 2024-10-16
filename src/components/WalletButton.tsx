import React, { useState, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";
import "../styles/components/_wallet-button.scss";

const WalletButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, balance, connectWallet, disconnectWallet, error } = context;

  const handleConnect = async () => {
    if (!address) {
      await connectWallet();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="wallet-button">
      <button onClick={handleConnect} className="btn wallet-button__toggle">
        {address
          ? `${address.substring(0, 6)}...${address.substring(
              address.length - 4
            )}`
          : "Connect Wallet"}
      </button>
      {isOpen && address && (
        <div className="wallet-button__popover">
          <p className="wallet-button__balance">Balance: {balance} ONE</p>
          <button
            onClick={disconnectWallet}
            className="btn btn--secondary wallet-button__disconnect"
          >
            Disconnect
          </button>
        </div>
      )}
      {error && <p className="wallet-button__error">{error}</p>}
    </div>
  );
};

export default WalletButton;
