import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'GUT - Grand Unified Theory of Cooking';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7FA',
          backgroundImage: 'linear-gradient(135deg, #F5F7FA 0%, #E8EBF0 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            left: -80,
            bottom: -80,
            width: 360,
            height: 360,
            borderRadius: '50%',
            backgroundColor: '#E8A598',
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -100,
            top: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: '#D4E157',
            opacity: 0.15,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {/* G.U.T. Title */}
          <div
            style={{
              fontSize: 140,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              color: '#1a1a1a',
              letterSpacing: -2,
            }}
          >
            G.U.T.
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              color: '#666666',
            }}
          >
            Grand Unified Theory of Cooking
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              fontFamily: 'system-ui, sans-serif',
              color: '#888888',
              marginTop: 10,
            }}
          >
            For people who ship code, and want to ship dinner too.
          </div>
        </div>

        {/* 5 F's row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 60,
            marginTop: 60,
          }}
        >
          {[
            { name: 'Fat', color: '#E8A598' },
            { name: 'Foundation', color: '#A8D5BA' },
            { name: 'Feature', color: '#E8B4A8' },
            { name: 'Flavor', color: '#B4C8E8' },
            { name: 'Finish', color: '#D4E157' },
          ].map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  fontFamily: 'system-ui, sans-serif',
                  color: '#666666',
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* Cooking pan icon */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="50" cy="60" r="40" fill="none" stroke="#1a1a1a" strokeWidth="4" />
            <line x1="90" y1="60" x2="115" y2="60" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 20 Q40 5 30 -10" fill="none" stroke="#888" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 15 Q60 0 50 -15" fill="none" stroke="#888" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 20 Q80 5 70 -10" fill="none" stroke="#888" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
