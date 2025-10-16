export interface NFT {
  tokenId: string;
  contractAddress: string;
  imageUrl: string;
  name: string;
  collection: 'WoW' | 'WoWG';
}

export interface NFTMetadata {
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}
