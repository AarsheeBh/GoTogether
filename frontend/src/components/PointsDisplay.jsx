import React from 'react';

function PointsDisplay({ points, level, discountTier, completedActivities }) {
  return (
    <div 
      className="fixed top-6 left-6 z-10"
      style={{
        background: 'linear-gradient(145deg, rgba(26, 15, 10, 0.95) 0%, rgba(44, 24, 16, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(139, 69, 19, 0.4)',
        borderRadius: '16px',
        padding: '16px 24px',
        boxShadow: `
          0 20px 40px rgba(0,0,0,0.5),
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(218, 165, 32, 0.2)
        `,
        minWidth: '220px'
      }}
    >
      {/* Points Section */}
      <div className="mb-3">
        <div 
          className="flex items-center justify-between mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span className="text-xs text-gray-400 uppercase tracking-wider">Points</span>
          <span 
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)'
            }}
          >
            {points || 0}
          </span>
        </div>
        
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(145deg, #8B4513 0%, #654321 100%)',
              color: '#FFD700',
              border: '1px solid rgba(218, 165, 32, 0.3)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)'
            }}
          >
            Level {level || 1}
          </div>
          <span className="text-xs text-gray-400">
            {completedActivities || 0} completed
          </span>
        </div>
      </div>

      {/* Discount Badge */}
      {discountTier && discountTier.discount > 0 && (
        <div 
          className="mt-3 pt-3"
          style={{
            borderTop: '1px solid rgba(139, 69, 19, 0.3)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div 
                className="text-xs font-semibold"
                style={{ color: '#D2691E' }}
              >
                {discountTier.name}
              </div>
              <div className="text-xs text-gray-400">Discount Tier</div>
            </div>
            <div 
              className="text-xl font-bold"
              style={{
                color: '#32CD32',
                textShadow: '0 2px 8px rgba(50, 205, 50, 0.3)'
              }}
            >
              {discountTier.discount}%
            </div>
          </div>
        </div>
      )}

      {/* Quick Icon */}
      <div 
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 100%)',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
          fontSize: '16px'
        }}
      >
        ⭐
      </div>
    </div>
  );
}

export default PointsDisplay;


