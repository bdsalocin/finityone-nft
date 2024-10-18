export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  creator: string; // Ajout de la propriété creator
  isListed: boolean; // Ajout de la propriété isListed
  type: "collected" | "created" | "favorited";
  collectionAddress: string;
}

export interface NewNFTMetadata {
  name: string;
  description: string;
  image: string;
}
