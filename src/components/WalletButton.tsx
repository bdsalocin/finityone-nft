import React, { useState, useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";

const WalletButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("WalletContext not found");
  }

  const { address, balance, connectWallet, disconnectWallet } = context;

  const handleConnect = async () => {
    if (!address) {
      await connectWallet();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleConnect();
  };

  return (
    <div className="wallet-button">
      <button onClick={handleButtonClick} className="wallet-button__toggle">
        {address
          ? `${address.substring(0, 6)}...${address.substring(
              address.length - 4
            )}`
          : "Connect Wallet"}
      </button>

      {isOpen && address && (
        <div
          className="wallet-button__popover"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="wallet-button__balance">
            <div className="wallet-button__balance-label">Balance:</div>
            <div className="wallet-button__balance-value">{balance} ONE</div>
          </div>
          <button
            onClick={() => {
              disconnectWallet();
              setIsOpen(false);
            }}
            className="wallet-button__disconnect"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
