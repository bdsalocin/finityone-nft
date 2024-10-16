import { ethers } from "ethers";
import { ONEFINITY_TESTNET } from "../config/networkConfig";

export const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [ONEFINITY_TESTNET],
      });

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      return { provider, signer, address };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  } else {
    throw new Error("No Ethereum wallet found");
  }
};
