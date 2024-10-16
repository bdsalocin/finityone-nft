export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  type: "collected" | "created" | "favorited";
}

export interface NewNFTMetadata {
  name: string;
  description: string;
  image: string;
}
