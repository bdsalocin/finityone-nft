import { ethers } from "ethers";
import { NFT } from "../types";
import { networkConfig, contractAddresses } from "../config";

const ONEFINITY_RPC = "https://testnet-rpc.onefinity.network";
const CHAIN_ID = 999987;

const ERC721_INTERFACE_ID = "0x80ac58cd";
const ERC1155_INTERFACE_ID = "0xd9b67a26";

const MINIMAL_ERC721_ABI = [
  "function supportsInterface(bytes4 interfaceId) external view returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) public",
  "function isApprovedForAll(address owner, address operator) public view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) public",
];

const MARKETPLACE_ABI = [
  "function listItem(address nftAddress, uint256 tokenId, uint256 price) external",
  "function buyItem(address nftAddress, uint256 tokenId) external payable",
  "function cancelListing(address nftAddress, uint256 tokenId) external",
];

export class OnefinityNFTService {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  private nftContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;

  constructor(nftContractAddress: string, marketplaceContractAddress: string) {
    this.provider = new ethers.providers.JsonRpcProvider(
      networkConfig.rpcUrls[0]
    );
    this.nftContract = new ethers.Contract(
      nftContractAddress,
      MINIMAL_ERC721_ABI,
      this.provider
    );
    this.marketplaceContract = new ethers.Contract(
      marketplaceContractAddress,
      MARKETPLACE_ABI,
      this.provider
    );
  }

  async connect(): Promise<string> {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkConfig],
      });

      await window.ethereum.request({ method: "eth_requestAccounts" });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      this.nftContract = new ethers.Contract(
        contractAddresses.nftToken,
        MINIMAL_ERC721_ABI,
        this.signer
      );
      this.marketplaceContract = new ethers.Contract(
        contractAddresses.nftMarketplace,
        MARKETPLACE_ABI,
        this.signer
      );

      return await this.signer.getAddress();
    } else {
      throw new Error("Please install MetaMask");
    }
  }

  isConnected(): boolean {
    return this.signer !== null;
  }

  async getConnectedAddress(): Promise<string | null> {
    if (this.signer) {
      return await this.signer.getAddress();
    }
    return null;
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async getAllCollections(): Promise<string[]> {
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
        const metadata = await fetch(tokenURI).then((res) => res.json());

        nfts.push({
          id: tokenId.toString(),
          name: metadata.name || `NFT ${tokenId}`,
          description:
            metadata.description || `NFT from collection ${collectionAddress}`,
          image: metadata.image || "https://via.placeholder.com/150",
          price: "0", // You may need to implement a way to get the price
          owner,
          creator: metadata.creator || owner, // Add creator property
          isListed: false, // Add isListed property, default to false
          type: "collected",
          collectionAddress,
        });
        tokenId++;
      } catch (error) {
        break;
      }
    }

    return nfts;
  }
  async getUserNFTs(address: string): Promise<NFT[]> {
    const collections = await this.getAllCollections();
    let userNFTs: NFT[] = [];
    for (const collection of collections) {
      const collectionNFTs = await this.getNFTsForCollection(collection);
      userNFTs = userNFTs.concat(
        collectionNFTs
          .filter((nft) => nft.owner === address || nft.creator === address)
          .map((nft) => ({
            ...nft,
            creator: nft.creator || address, // Si creator n'est pas défini, on suppose que le propriétaire est le créateur
            isListed: nft.price !== "0", // On suppose qu'un NFT est listé si son prix n'est pas 0
          }))
      );
    }
    return userNFTs;
  }

  async mintNFT(tokenURI: string): Promise<void> {
    if (!this.signer || !this.nftContract) {
      throw new Error("Wallet not connected or NFT contract not initialized");
    }

    const tx = await this.nftContract.mint(
      await this.signer.getAddress(),
      tokenURI
    );
    await tx.wait();
  }

  async listNFT(tokenId: number, price: string): Promise<void> {
    if (!this.signer || !this.nftContract || !this.marketplaceContract) {
      throw new Error("Wallet not connected or contracts not initialized");
    }

    const isApproved = await this.nftContract.isApprovedForAll(
      await this.signer.getAddress(),
      contractAddresses.nftMarketplace
    );
    if (!isApproved) {
      const approveTx = await this.nftContract.setApprovalForAll(
        contractAddresses.nftMarketplace,
        true
      );
      await approveTx.wait();
    }

    const listTx = await this.marketplaceContract.listItem(
      contractAddresses.nftToken,
      tokenId,
      ethers.utils.parseEther(price)
    );
    await listTx.wait();
  }

  async buyNFT(tokenId: number, price: string): Promise<void> {
    if (!this.signer || !this.marketplaceContract) {
      throw new Error(
        "Wallet not connected or marketplace contract not initialized"
      );
    }

    const buyTx = await this.marketplaceContract.buyItem(
      contractAddresses.nftToken,
      tokenId,
      {
        value: ethers.utils.parseEther(price),
      }
    );
    await buyTx.wait();
  }

  async cancelListing(tokenId: number): Promise<void> {
    if (!this.signer || !this.marketplaceContract) {
      throw new Error(
        "Wallet not connected or marketplace contract not initialized"
      );
    }

    const cancelTx = await this.marketplaceContract.cancelListing(
      contractAddresses.nftToken,
      tokenId
    );
    await cancelTx.wait();
  }
}

export default OnefinityNFTService;
