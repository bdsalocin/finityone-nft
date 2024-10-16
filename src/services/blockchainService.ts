import { ethers } from "ethers";
import { networkConfig } from "../config";

class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  async init() {
    if (typeof window.ethereum !== "undefined") {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkConfig],
      });
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("Provider not initialized");
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async sendTransaction(
    to: string,
    amount: string
  ): Promise<ethers.providers.TransactionReceipt> {
    if (!this.signer) throw new Error("Signer not initialized");
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount),
    });
    return await tx.wait();
  }

  async getNetwork(): Promise<ethers.providers.Network> {
    if (!this.provider) throw new Error("Provider not initialized");
    return await this.provider.getNetwork();
  }
}

export const blockchainService = new BlockchainService();
