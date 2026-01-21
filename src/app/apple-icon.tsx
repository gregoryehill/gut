import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #E8A598 0%, #D4847A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a1a1a',
          borderRadius: 36,
        }}
      >
        G
      </div>
    ),
    {
      ...size,
    }
  );
}
