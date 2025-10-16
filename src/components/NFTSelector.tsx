import { useState } from 'react';
import type { NFT } from '@/types/nft';
import { Card } from '@/components/ui/card';

interface NFTSelectorProps {
  nfts: NFT[];
  selectedNFT: NFT | null;
  onSelect: (nft: NFT) => void;
  collectionFilter?: 'WoW' | 'WoWG' | 'all';
}

export function NFTSelector({ nfts, selectedNFT, onSelect, collectionFilter = 'all' }: NFTSelectorProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Filter NFTs based on collection
  const filteredNFTs = collectionFilter === 'all'
    ? nfts
    : nfts.filter(nft => nft.collection === collectionFilter);

  const handleImageError = (tokenId: string) => {
    setImageErrors(prev => new Set([...prev, tokenId]));
  };

  if (filteredNFTs.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-5xl mb-4">🎨</div>
        <p
          className="text-[#F4E8DC]/80 text-lg"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {collectionFilter === 'all'
            ? 'No WoW or WoWG NFTs found in your wallet'
            : `No ${collectionFilter} NFTs found in your wallet`
          }
        </p>
        <p
          className="text-[#F4E8DC]/60 text-sm mt-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Please make sure your wallet is connected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredNFTs.map((nft) => {
          const isSelected = selectedNFT?.tokenId === nft.tokenId;
          const hasError = imageErrors.has(nft.tokenId);

          return (
            <Card
              key={`${nft.contractAddress}-${nft.tokenId}`}
              onClick={() => onSelect(nft)}
              className={`
                cursor-pointer transition-all duration-300 overflow-hidden
                bg-gradient-to-br from-[#1D1B3A]/60 to-[#0C0A1E]/60
                backdrop-blur-md border-2
                hover:scale-105 hover:shadow-xl
                ${isSelected
                  ? 'border-[#9B8DE3] shadow-[0_0_20px_rgba(155,141,227,0.5)]'
                  : 'border-[#9B8DE3]/30 hover:border-[#F8A1D1]/50'
                }
              `}
            >
              <div className="aspect-square relative overflow-hidden">
                {!hasError ? (
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(nft.tokenId)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#9B8DE3]/20 to-[#F8A1D1]/20">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#9B8DE3]/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#9B8DE3] flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Collection badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`
                      px-2 py-1 rounded-full text-xs font-semibold
                      ${nft.collection === 'WoW'
                        ? 'bg-[#9B8DE3] text-white'
                        : 'bg-[#F8A1D1] text-white'
                      }
                    `}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {nft.collection}
                  </span>
                </div>
              </div>

              {/* NFT name */}
              <div className="p-3 text-center">
                <p
                  className="text-[#F4E8DC] text-sm font-medium truncate"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  title={nft.name}
                >
                  {nft.name}
                </p>
                <p
                  className="text-[#F4E8DC]/60 text-xs"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  #{nft.tokenId}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected NFT info */}
      {selectedNFT && (
        <div
          className="mt-4 p-4 rounded-lg bg-gradient-to-r from-[#9B8DE3]/20 to-[#F8A1D1]/20 border border-[#9B8DE3]/40"
        >
          <p
            className="text-[#F4E8DC] text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
          >
            Selected: <span className="font-semibold">{selectedNFT.name}</span>
          </p>
        </div>
      )}
    </div>
  );
}
