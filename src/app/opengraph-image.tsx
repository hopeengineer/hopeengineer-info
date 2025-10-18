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
  // Using the direct URL to your image
  const userImage = 'https://i.imgur.com/uiFxqeG.jpeg';

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
          padding: '60px',
        }}
      >
        <img
          src={userImage}
          alt="HopeEngineer Portrait"
          width={128}
          height={128}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '40px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        />
        <h1
          style={{
            fontSize: '80px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Engineer Your Hope,
          <br />
          Build Your Future.
        </h1>
        <p
          style={{
            fontSize: '30px',
            color: '#A1A1AA', // muted foreground
            textAlign: 'center',
            maxWidth: '80%',
            marginTop: '20px'
          }}
        >
          Exploring the intersection of technology, personal growth, and artificial intelligence.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
