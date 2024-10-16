import { ethers } from "ethers";

class MetamaskServices {
  private provider: ethers.providers.Web3Provider | null = null;

  async connect(): Promise<string> {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Demande à l'utilisateur de se connecter à MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });

        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = this.provider.getSigner();
        return await signer.getAddress();
      } catch (error) {
        console.error("Erreur lors de la connexion à MetaMask:", error);
        throw new Error("Impossible de se connecter à MetaMask");
      }
    } else {
      throw new Error("MetaMask n'est pas installé");
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("MetaMask n'est pas connecté");
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  getProvider(): ethers.providers.Web3Provider {
    if (!this.provider) throw new Error("MetaMask n'est pas connecté");
    return this.provider;
  }

  async switchToOnefinityNetwork(): Promise<void> {
    if (!this.provider) throw new Error("MetaMask n'est pas connecté");

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xF4233" }], // chainId de OneFinity en hexadécimal
      });
    } catch (error: any) {
      // Si le réseau n'existe pas, on l'ajoute
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xF4233",
              chainName: "OneFinity Testnet",
              nativeCurrency: {
                name: "ONE",
                symbol: "ONE",
                decimals: 18,
              },
              rpcUrls: ["https://testnet-rpc.onefinity.network"],
              blockExplorerUrls: [
                "https://testnet-explorer.onefinity.network/",
              ],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }
}

export default new MetamaskServices();
