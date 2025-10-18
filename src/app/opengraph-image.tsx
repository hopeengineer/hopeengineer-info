import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'HopeEngineer Hub';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B', // background dark
          color: '#FAFAFA', // foreground dark
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="128" 
            height="128" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>
        </svg>
        <h1
          style={{
            fontSize: '80px',
            marginTop: '40px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          HopeEngineer Hub
        </h1>
        <p
          style={{
            fontSize: '30px',
            color: '#A1A1AA', // muted foreground
          }}
        >
          The personal website of the HopeEngineer
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
