import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateNumerologyData, type NumerologyData } from '@/utils/numerology';

interface ReadingPageProps {
  userData: {
    name: string;
    birthDate: Date;
  };
  onBack?: () => void;
  onNewReading?: () => void;
}

interface DiamondData extends NumerologyData {
  top: number;
  bottom: string | number;
  left: string | number;
  center: string | number | null;
  center2?: string | number | null;
  right: string | number;
  up_mid_left: string | number;
  up_mid_center: string;
  up_mid_right: string | number;
  low_mid_left: string | number;
  low_mid_center: string;
  low_mid_right: string | number;
  details: Array<{
    Type: string;
    Number: string | number;
    Description: string;
  }>;
}

interface GroupedData {
  [key: string]: Array<{
    Type: string;
    Number: string | number;
    Description: string;
  }>;
}

const HeadingWithLine: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex items-center gap-3">
      <span className="text-purple-300 text-lg">✦</span>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
      <span className="text-2xl font-bold text-purple-300 font-serif px-4 whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
      <span className="text-purple-300 text-lg">✦</span>
    </div>
  </div>
);

const DiamondOverlay: React.FC<{
  position: string;
  value: string | number;
  onHover: (type: string | null) => void;
  hoveredNumber: string | null;
}> = ({ position, value, onHover, hoveredNumber }) => {
  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top':
        return 'top-[6%] left-1/2';
      case 'bottom':
        return 'bottom-[-5%] left-1/2';
      case 'left':
        return 'top-1/2 left-[7%]';
      case 'up-mid-left':
        return 'top-[25%] left-[20.7%]';
      case 'low-mid-left':
        return 'bottom-[15%] left-[20.7%]';
      case 'center':
        return 'top-1/2 left-[50.5%]';
      case 'up-mid-center':
        return 'top-[25%] left-[50.5%]';
      case 'low-mid-center':
        return 'bottom-[15%] left-[50.5%]';
      case 'right':
        return 'top-1/2 right-[-5%]';
      case 'up-mid-right':
        return 'top-[25%] right-[7%]';
      case 'low-mid-right':
        return 'bottom-[15%] right-[7%]';
      default:
        return '';
    }
  };

  const formatPosition = (pos: string) => {
    switch (pos) {
      case 'up-mid-left':
        return 'UpMidLeft';
      case 'up-mid-center':
        return 'UpMidCenter';
      case 'up-mid-right':
        return 'UpMidRight';
      case 'low-mid-left':
        return 'LowMidLeft';
      case 'low-mid-center':
        return 'LowMidCenter';
      case 'low-mid-right':
        return 'LowMidRight';
      default:
        return pos.charAt(0).toUpperCase() + pos.slice(1);
    }
  };

  const formattedPosition = formatPosition(position);
  const isHovered = hoveredNumber === formattedPosition;

  return (
    <div
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2
        w-16 h-16 rounded-full flex items-center justify-center
        font-serif font-black text-lg text-black
        transition-all duration-300 cursor-pointer
        border border-white/50 backdrop-blur-sm
        ${isHovered
          ? 'bg-purple-400/60 text-white scale-125 shadow-lg shadow-purple-400/50'
          : 'bg-black/20'
        }
        hover:bg-purple-400/60 hover:text-white hover:scale-125 hover:shadow-lg hover:shadow-purple-400/50
        ${getPositionClasses(position)}
      `}
      onMouseEnter={() => onHover(formattedPosition)}
      onMouseLeave={() => onHover(null)}
    >
      {value}
    </div>
  );
};

const ReadingPage: React.FC<ReadingPageProps> = ({ userData }) => {
  const [readingData, setReadingData] = useState<DiamondData | null>(null);
  const [groupedData, setGroupedData] = useState<GroupedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNumber, setHoveredNumber] = useState<string | null>(null);

  const { name, birthDate } = userData;

  useEffect(() => {
    setTimeout(() => {
      // Use centralized calculation function
      const numerologyData = calculateNumerologyData(name, birthDate);

      // Transform to diamond format
      const data: DiamondData = {
        ...numerologyData,
        top: numerologyData.diamond_upper_value,
        bottom: numerologyData.diamond_lower_value,
        left: numerologyData.nameValues[0],
        center: numerologyData.nameValues.length === 3 ? numerologyData.nameValues[1] :
                numerologyData.nameValues.length === 4 ? numerologyData.nameValues[1] : null,
        center2: numerologyData.nameValues.length === 4 ? numerologyData.nameValues[2] : null,
        right: numerologyData.nameValues[numerologyData.nameValues.length - 1],
        up_mid_left: numerologyData.diamond_upper_mid[0],
        up_mid_center: numerologyData.diamond_upper_lower_circle.length > 0 ?
                      `${numerologyData.diamond_upper_circle[0]} ${numerologyData.diamond_upper_lower_circle[0]}` :
                      numerologyData.diamond_upper_circle[0].toString(),
        up_mid_right: numerologyData.diamond_upper_mid[numerologyData.diamond_upper_mid.length - 1],
        low_mid_left: numerologyData.diamond_lower_mid[0],
        low_mid_center: numerologyData.diamond_lower_lower_circle.length > 0 ?
                       `${numerologyData.diamond_lower_circle[0]} ${numerologyData.diamond_lower_lower_circle[0]}` :
                       numerologyData.diamond_lower_circle[0].toString(),
        low_mid_right: numerologyData.diamond_lower_mid[numerologyData.diamond_lower_mid.length - 1],
        details: [
          { Type: "Top", Number: numerologyData.diamond_upper_value, Description: 'Description for top Number' },
          { Type: "Bottom", Number: numerologyData.diamond_lower_value, Description: 'Description for bottom Number' },
          { Type: "Left", Number: numerologyData.nameValues[0], Description: 'Description for Heart\'s Desire Number' },
          { Type: "Right", Number: numerologyData.nameValues[numerologyData.nameValues.length - 1], Description: 'Description for Personality Number' },
          { Type: "Center", Number: numerologyData.nameValues.length === 3 ? numerologyData.nameValues[1] :
                                    numerologyData.nameValues.length === 4 ? `${numerologyData.nameValues[1]} ${numerologyData.nameValues[2]}` : "N/A",
                   Description: 'Description for Name Path Number' },
          { Type: "UpMidLeft", Number: numerologyData.diamond_upper_mid[0], Description: 'Description for Blabla Number' },
          { Type: "UpMidCenter", Number: numerologyData.diamond_upper_lower_circle.length > 0 ?
                                         `${numerologyData.diamond_upper_circle[0]} ${numerologyData.diamond_upper_lower_circle[0]}` :
                                         numerologyData.diamond_upper_circle[0],
                   Description: 'Description for Blabla Number' },
          { Type: "UpMidRight", Number: numerologyData.diamond_upper_mid[numerologyData.diamond_upper_mid.length - 1], Description: 'Description for Blabla Number' },
          { Type: "LowMidLeft", Number: numerologyData.diamond_lower_mid[0], Description: 'Description for Blabla Number' },
          { Type: "LowMidCenter", Number: numerologyData.diamond_lower_lower_circle.length > 0 ?
                                          `${numerologyData.diamond_lower_circle[0]} ${numerologyData.diamond_lower_lower_circle[0]}` :
                                          numerologyData.diamond_lower_circle[0],
                   Description: 'Description for Blabla Number' },
          { Type: "LowMidRight", Number: numerologyData.diamond_lower_mid[numerologyData.diamond_lower_mid.length - 1], Description: 'Description for Blabla Number' }
        ]
      };

      const groupedData: GroupedData = {
        "Essence": data.details.filter(entry => ["Top"].includes(entry.Type)),
        "Destiny Numbers": data.details.filter(entry => ["Left", "Center", "Right"].includes(entry.Type)),
        "Aura Numbers": data.details.filter(entry => ["UpMidLeft", "UpMidRight", "LowMidLeft", "LowMidRight"].includes(entry.Type)),
        "Life Theme": data.details.filter(entry => ["Bottom"].includes(entry.Type)),
        "Centre Energy": data.details.filter(entry => ["UpMidCenter", "LowMidCenter"].includes(entry.Type))
      };

      setGroupedData(groupedData);
      setReadingData(data);
      setLoading(false);
    }, 2000);
  }, [name, birthDate]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300"></div>
        <h6 className="text-purple-200 mt-4 font-serif text-xl">
          Calculating your cosmic numbers...
        </h6>
      </div>
    );
  }

  if (!readingData || !groupedData) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white font-serif text-center mb-4">
          Your Sacred Numbers
        </h1>

        {/* Birthday Planet Display */}
        {readingData.birthdayInterpretation && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-effect border border-white/20 rounded-full">
              <span className="text-purple-300 text-xl">✦</span>
              <span className="text-xl text-purple-200 font-serif">
                Birthday Planet:
              </span>
              <span className="text-2xl font-bold text-white font-serif">
                {readingData.birthdayInterpretation.planetName}
              </span>
              <span className="text-purple-300 text-xl">✦</span>
            </div>
          </div>
        )}

        {/* Diamond Chart */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-block">
            {/* Diamond Image - you'll need to copy the diamond image to public folder */}
            <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border-2 border-white/50 shadow-2xl flex items-center justify-center text-white font-bold text-2xl">
              Diamond Chart
            </div>

            {/* Number Overlays */}
            <DiamondOverlay position="top" value={readingData.top} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="bottom" value={readingData.bottom} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="left" value={readingData.left} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="center" value={readingData.center || 'N/A'} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="right" value={readingData.right} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="up-mid-left" value={readingData.up_mid_left} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="up-mid-center" value={readingData.up_mid_center} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="up-mid-right" value={readingData.up_mid_right} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="low-mid-left" value={readingData.low_mid_left} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="low-mid-center" value={readingData.low_mid_center} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
            <DiamondOverlay position="low-mid-right" value={readingData.low_mid_right} onHover={setHoveredNumber} hoveredNumber={hoveredNumber} />
          </div>
        </div>

        {/* Grouped Readings */}
        <div className="space-y-12">
          {Object.keys(groupedData).map((group, groupIndex) => (
            <div key={groupIndex}>
              <HeadingWithLine text={group} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {groupedData[group].map((entry, id) => (
                  <Card
                    key={id}
                    className={`
                      glass-effect border-white/20 transition-all duration-300 hover:scale-105
                      ${hoveredNumber === entry.Type
                        ? 'bg-purple-400/20 shadow-lg shadow-purple-400/40'
                        : 'hover:bg-purple-400/20 hover:shadow-lg hover:shadow-purple-400/40'
                      }
                    `}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="text-3xl font-bold text-white font-serif">
                        {entry.Number}
                      </div>
                      <div className="text-xl font-semibold text-purple-300 font-serif">
                        {entry.Type}
                      </div>
                      <div className="text-purple-200 font-serif leading-relaxed">
                        {entry.Description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;