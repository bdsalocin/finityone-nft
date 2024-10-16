import { ethers } from "ethers";
import { NFT } from "../types";

const ONEFINITY_RPC = "https://testnet-rpc.onefinity.network";
const CHAIN_ID = 999987;

const ERC721_INTERFACE_ID = "0x80ac58cd";
const ERC1155_INTERFACE_ID = "0xd9b67a26";

const MINIMAL_ERC721_ABI = [
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function setApprovalForAll(address operator, bool _approved)",
];

class OnefinityNFTService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      console.warn("Ethereum object not found, please install MetaMask.");
    }
  }

  async init(nftContractAddress: string, marketplaceContractAddress: string) {
    // Initialiser les contrats avec les adresses fournies
    console.log(
      `Initializing contracts: NFT(${nftContractAddress}), Marketplace(${marketplaceContractAddress})`
    );
  }
  async mintNFT(collectionName: string, tokenURI: string) {
    // Logique pour minter un NFT
    console.log(
      `Minting NFT in collection ${collectionName} with tokenURI: ${tokenURI}`
    );
  }
  async connect(): Promise<string> {
    if (!this.provider) {
      throw new Error("Web3 provider not found");
    }

    await this.switchNetwork();

    // Request account access
    await this.provider.send("eth_requestAccounts", []);
    this.signer = this.provider.getSigner();
    return await this.signer.getAddress();
  }

  private async switchNetwork() {
    if (!this.provider) return;

    const network = await this.provider.getNetwork();
    if (network.chainId !== CHAIN_ID) {
      try {
        await this.provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${CHAIN_ID.toString(16)}` },
        ]);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await this.provider.send("wallet_addEthereumChain", [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: "OneFinity Testnet",
              nativeCurrency: { name: "ONE", symbol: "ONE", decimals: 18 },
              rpcUrls: [ONEFINITY_RPC],
              blockExplorerUrls: [
                "https://testnet-explorer.onefinity.network/",
              ],
            },
          ]);
        } else {
          throw switchError;
        }
      }
    }
  }

  async getAllCollections(): Promise<string[]> {
    if (!this.provider) throw new Error("Provider not initialized");

    const latestBlock = await this.provider.getBlockNumber();
    const collections: string[] = [];

    for (let i = 0; i <= latestBlock; i++) {
      const block = await this.provider.getBlockWithTransactions(i);
      for (const tx of block.transactions) {
        if (tx.to === null) {
          const receipt = await this.provider.getTransactionReceipt(tx.hash);
          if (receipt && receipt.contractAddress) {
            const code = await this.provider.getCode(receipt.contractAddress);
            if (code !== "0x") {
              const contract = new ethers.Contract(
                receipt.contractAddress,
                MINIMAL_ERC721_ABI,
                this.provider
              );
              try {
                const isERC721 = await contract.supportsInterface(
                  ERC721_INTERFACE_ID
                );
                const isERC1155 = await contract.supportsInterface(
                  ERC1155_INTERFACE_ID
                );
                if (isERC721 || isERC1155) {
                  collections.push(receipt.contractAddress);
                }
              } catch (error) {
                console.error(
                  `Error checking contract at ${receipt.contractAddress}:`,
                  error
                );
              }
            }
          }
        }
      }
    }

    return collections;
  }

  async getNFTsForCollection(collectionAddress: string): Promise<NFT[]> {
    if (!this.provider) throw new Error("Provider not initialized");

    const contract = new ethers.Contract(
      collectionAddress,
      MINIMAL_ERC721_ABI,
      this.provider
    );
    const nfts: NFT[] = [];
    let tokenId = 0;

    while (true) {
      try {
        const owner = await contract.ownerOf(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);
        nfts.push({
          id: tokenId.toString(),
          name: `NFT ${tokenId}`,
          description: `NFT from collection ${collectionAddress}`,
          image: tokenURI,
          price: "0", // You may want to implement a price fetching mechanism
          owner,
          type: "collected", // Default type, you may want to implement a type determination logic
        });
        tokenId++;
      } catch (error) {
        break;
      }
    }

    return nfts;
  }

  async buyNFT(collectionAddress: string, tokenId: number, price: string) {
    if (!this.signer) throw new Error("Wallet not connected");

    const contract = new ethers.Contract(
      collectionAddress,
      MINIMAL_ERC721_ABI,
      this.signer
    );
    const tx = await contract.safeTransferFrom(
      await contract.ownerOf(tokenId),
      await this.signer.getAddress(),
      tokenId,
      {
        value: ethers.utils.parseEther(price),
      }
    );
    await tx.wait();
  }

  async listNFT(collectionAddress: string, tokenId: number, price: string) {
    if (!this.signer) throw new Error("Wallet not connected");

    const contract = new ethers.Contract(
      collectionAddress,
      MINIMAL_ERC721_ABI,
      this.signer
    );
    const marketplaceAddress = "YOUR_MARKETPLACE_CONTRACT_ADDRESS";
    const tx = await contract.setApprovalForAll(marketplaceAddress, true);
    await tx.wait();

    console.log(
      `NFT ${tokenId} from collection ${collectionAddress} approved for listing at price ${price}`
    );
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("Provider not initialized");

    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async getUserNFTs(address: string): Promise<NFT[]> {
    if (!this.provider) throw new Error("Provider not initialized");
    const collections = await this.getAllCollections();
    let userNFTs: NFT[] = [];
    for (const collection of collections) {
      const collectionNFTs = await this.getNFTsForCollection(collection);
      userNFTs = userNFTs.concat(
        collectionNFTs.filter((nft: NFT) => nft.owner === address)
      );
    }
    return userNFTs;
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  isConnected(): boolean {
    return this.signer !== null;
  }
}

export default OnefinityNFTService;
