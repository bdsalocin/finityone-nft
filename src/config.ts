export const networkConfig = {
  chainId: "0xF4233", // Hexadecimal representation of 999987, including '0x' prefix
  chainName: "OneFinityNetwork Testnet",
  nativeCurrency: {
    name: "ONE",
    symbol: "ONE",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.onefinity.network"],
  blockExplorerUrls: ["https://testnet-explorer.onefinity.network/"],
};

export const contractAddresses = {
  nftMarketplace: "0x...", // Replace with the actual address of your NFT Marketplace contract
  nftToken: "0x...", // Replace with the actual address of your NFT Token contract
};

export const apiConfig = {
  baseUrl: "https://api.your-nft-platform.com", // Replace with the base URL of your API
  timeout: 5000,
};