import React from 'react';

function ActivityMap({ activities, onPinClick }) {
  // Helper to get a consistent position for a given location string
  const getPinPosition = (location) => {
    let hash = 0;
    for (let i = 0; i < location.length; i++) {
      hash = location.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = ((hash % 70) + 15);
    const y = (((hash >> 7) % 70) + 15);
    return { x, y };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      grocery: '🛒',
      walk: '🚶',
      carpool: '🚗',
      errands: '📋',
      shopping: '🛍️',
      gym: '💪',
      dining: '🍽️',
      other: '📍'
    };
    return icons[category] || '📍';
  };

  const getCategoryWoodStyle = (category) => {
    const styles = {
      grocery: {
        wood: 'linear-gradient(145deg, #8B4513 0%, #654321 50%, #3E2723 100%)',
        accent: '#D2691E',
        glow: 'rgba(210, 105, 30, 0.4)',
        name: 'Mahogany'
      },
      walk: {
        wood: 'linear-gradient(145deg, #6B4423 0%, #4A2C1A 50%, #2C1810 100%)',
        accent: '#8B6F47',
        glow: 'rgba(139, 111, 71, 0.4)',
        name: 'Walnut'
      },
      carpool: {
        wood: 'linear-gradient(145deg, #5D4037 0%, #3E2723 50%, #1B0000 100%)',
        accent: '#795548',
        glow: 'rgba(121, 85, 72, 0.4)',
        name: 'Rosewood'
      },
      errands: {
        wood: 'linear-gradient(145deg, #A0826D 0%, #8B7355 50%, #6B5742 100%)',
        accent: '#C4A57B',
        glow: 'rgba(196, 165, 123, 0.4)',
        name: 'Oak'
      },
      shopping: {
        wood: 'linear-gradient(145deg, #CD853F 0%, #A0714D 50%, #704A2C 100%)',
        accent: '#DEB887',
        glow: 'rgba(222, 184, 135, 0.4)',
        name: 'Maple'
      },
      gym: {
        wood: 'linear-gradient(145deg, #8B0000 0%, #5C0000 50%, #2C0000 100%)',
        accent: '#A52A2A',
        glow: 'rgba(165, 42, 42, 0.4)',
        name: 'Cherry'
      },
      dining: {
        wood: 'linear-gradient(145deg, #BC8F8F 0%, #8B7765 50%, #5C4033 100%)',
        accent: '#D2B48C',
        glow: 'rgba(210, 180, 140, 0.4)',
        name: 'Birch'
      },
      other: {
        wood: 'linear-gradient(145deg, #3E2723 0%, #2C1810 50%, #1A0F0A 100%)',
        accent: '#4E342E',
        glow: 'rgba(78, 52, 46, 0.4)',
        name: 'Ebony'
      }
    };
    return styles[category] || styles.other;
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Vintage World Map Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/vintage-world-map.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {/* Subtle vintage overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(245,222,179,0.05) 0%, rgba(222,184,135,0.08) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      {/* Premium Wooden Activity Pins */}
      {activities.map((activity) => {
        const position = getPinPosition(activity.location);
        const woodStyle = getCategoryWoodStyle(activity.category);
        
        return (
          <div
            key={activity._id}
            className="absolute cursor-pointer group"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20
            }}
            onClick={() => onPinClick(activity)}
          >
            {/* Pin Container with 3D Perspective */}
            <div 
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px'
              }}
            >
              
              {/* Wooden Pin Shadow */}
              <div 
                className="pin-shadow absolute transition-all duration-500"
                style={{
                  width: '55px',
                  height: '22px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, transparent 80%)',
                  borderRadius: '50%',
                  top: '52px',
                  left: '-8px',
                  filter: 'blur(7px)',
                  transform: 'rotateX(75deg)',
                  opacity: 0.8
                }}
              />

              {/* Main Wooden Pin Body */}
              <div 
                className="relative transition-all duration-500 ease-out"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg) translateZ(15px)',
                  background: woodStyle.wood,
                  boxShadow: `
                    0 15px 40px rgba(0,0,0,0.5),
                    0 8px 20px rgba(0,0,0,0.3),
                    inset -3px -3px 8px rgba(0,0,0,0.4),
                    inset 3px 3px 8px rgba(255,255,255,0.1),
                    inset 0 0 20px rgba(0,0,0,0.2)
                  `,
                  border: '2px solid rgba(139, 69, 19, 0.6)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  const parent = e.currentTarget.parentElement;
                  e.currentTarget.style.transform = 'rotate(-45deg) translateZ(25px) translateY(-15px) scale(1.2)';
                  e.currentTarget.style.boxShadow = `
                    0 20px 50px rgba(0,0,0,0.6),
                    0 12px 30px rgba(0,0,0,0.4),
                    inset -3px -3px 8px rgba(0,0,0,0.5),
                    inset 3px 3px 8px rgba(255,255,255,0.15),
                    inset 0 0 20px rgba(0,0,0,0.3),
                    0 0 40px ${woodStyle.glow}
                  `;
                  parent.querySelector('.pin-shadow').style.transform = 'rotateX(75deg) scale(1.4)';
                  parent.querySelector('.pin-shadow').style.opacity = '0.5';
                }}
                onMouseLeave={(e) => {
                  const parent = e.currentTarget.parentElement;
                  e.currentTarget.style.transform = 'rotate(-45deg) translateZ(15px)';
                  e.currentTarget.style.boxShadow = `
                    0 15px 40px rgba(0,0,0,0.5),
                    0 8px 20px rgba(0,0,0,0.3),
                    inset -3px -3px 8px rgba(0,0,0,0.4),
                    inset 3px 3px 8px rgba(255,255,255,0.1),
                    inset 0 0 20px rgba(0,0,0,0.2)
                  `;
                  parent.querySelector('.pin-shadow').style.transform = 'rotateX(75deg) scale(1)';
                  parent.querySelector('.pin-shadow').style.opacity = '0.8';
                }}
              >
                {/* Wood Grain Texture Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    borderRadius: '50% 50% 50% 0',
                    background: `
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px
                      ),
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 8px,
                        rgba(0,0,0,0.05) 8px,
                        rgba(0,0,0,0.05) 10px
                      )
                    `,
                    opacity: 0.3,
                    mixBlendMode: 'multiply'
                  }}
                />

                {/* Wood Knot Details */}
                <div 
                  className="absolute"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '12px',
                    left: '18px',
                    opacity: 0.5
                  }}
                />
                <div 
                  className="absolute"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '30px',
                    left: '12px',
                    opacity: 0.4
                  }}
                />

                {/* Glossy Varnish Effect */}
                <div 
                  className="absolute"
                  style={{
                    width: '24px',
                    height: '24px',
                    background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 40%, transparent 70%)',
                    borderRadius: '50%',
                    top: '5px',
                    left: '5px',
                    transform: 'rotate(45deg)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Gold/Brass Rim Accent */}
                <div 
                  className="absolute inset-0"
                  style={{
                    borderRadius: '50% 50% 50% 0',
                    border: '1px solid rgba(218, 165, 32, 0.3)',
                    boxShadow: 'inset 0 0 8px rgba(218, 165, 32, 0.2)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Icon Container */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: 'rotate(45deg)',
                    fontSize: '24px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {getCategoryIcon(activity.category)}
                </div>

              </div>

              {/* Wooden Pin Point/Nail */}
              <div 
                className="absolute"
                style={{
                  width: '6px',
                  height: '14px',
                  background: 'linear-gradient(to bottom, #2C1810 0%, #1A0F0A 100%)',
                  borderRadius: '0 0 40% 40%',
                  top: '44px',
                  left: '22px',
                  transform: 'rotate(-45deg)',
                  boxShadow: `
                    inset -1px -1px 2px rgba(255,255,255,0.1),
                    inset 1px 1px 2px rgba(0,0,0,0.5),
                    0 2px 4px rgba(0,0,0,0.4)
                  `
                }}
              />

              {/* Ambient Wooden Glow */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  width: '80px',
                  height: '80px',
                  background: `radial-gradient(circle, ${woodStyle.glow} 0%, transparent 70%)`,
                  top: '-15px',
                  left: '-15px',
                  borderRadius: '50%',
                  animation: 'pulse 2.5s ease-in-out infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* Ripple Ring Effect */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                style={{
                  width: '100px',
                  height: '100px',
                  border: `2px solid ${woodStyle.accent}`,
                  top: '-25px',
                  left: '-25px',
                  borderRadius: '50%',
                  animation: 'ripple-expand 3s ease-out infinite',
                  pointerEvents: 'none',
                  opacity: 0.6
                }}
              />

            </div>

            {/* Elegant Information Card */}
            <div 
              className="absolute bottom-full left-1/2 mb-8 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-700"
              style={{
                transform: 'translateX(-50%) translateY(-10px) scale(0.9)',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <div 
                className="relative rounded-2xl px-8 py-5"
                style={{
                  minWidth: '260px',
                  background: `
                    linear-gradient(145deg, 
                      rgba(26, 15, 10, 0.98) 0%, 
                      rgba(44, 24, 16, 0.98) 50%,
                      rgba(26, 15, 10, 0.98) 100%
                    )
                  `,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '2px solid rgba(139, 69, 19, 0.4)',
                  boxShadow: `
                    0 25px 50px rgba(0,0,0,0.6),
                    0 15px 30px rgba(0,0,0,0.4),
                    inset 0 1px 0 rgba(218, 165, 32, 0.2),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
                    0 0 30px ${woodStyle.glow}
                  `
                }}
              >
                {/* Wood Texture on Card */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{
                    background: woodStyle.wood,
                    mixBlendMode: 'overlay',
                    pointerEvents: 'none'
                  }}
                />

                {/* Card Content */}
                <div className="relative text-center">
                  <div 
                    className="font-bold text-xl mb-3 leading-tight"
                    style={{
                      color: woodStyle.accent,
                      fontFamily: 'Georgia, serif',
                      letterSpacing: '0.5px',
                      textShadow: `
                        2px 2px 4px rgba(0,0,0,0.8),
                        0 0 10px ${woodStyle.glow}
                      `
                    }}
                  >
                    {activity.title}
                  </div>
                  
                  {/* Wood Type Badge */}
                  <div 
                    className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-semibold"
                    style={{
                      background: woodStyle.wood,
                      color: '#FFF',
                      border: `1px solid ${woodStyle.accent}`,
                      boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    {woodStyle.name}
                  </div>
                  
                  {/* User Info */}
                  <div 
                    className="flex items-center justify-center gap-2 mb-2"
                    style={{
                      color: '#D2B48C',
                      fontSize: '14px',
                      fontFamily: 'system-ui'
                    }}
                  >
                    <span className="text-base">👤</span>
                    <span className="font-medium">{activity.user.name}</span>
                  </div>
                  
                  {/* Location */}
                  <div 
                    className="flex items-center justify-center gap-2"
                    style={{
                      color: '#BC8F8F',
                      fontSize: '13px'
                    }}
                  >
                    <span className="text-base">📍</span>
                    <span>{activity.location}</span>
                  </div>
                </div>

                {/* Decorative Brass Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-600 opacity-50 rounded-tl" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-600 opacity-50 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-600 opacity-50 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-600 opacity-50 rounded-br" />

                {/* Card Arrow */}
                <div 
                  className="absolute"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '16px solid transparent',
                    borderRight: '16px solid transparent',
                    borderTop: '16px solid rgba(26, 15, 10, 0.98)',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
                  }}
                />
              </div>
            </div>

          </div>
        );
      })}

    </div>
  );
}

export default ActivityMap;
