
import { ImageResponse } from 'next/og';
import { Code } from 'lucide-react';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B', // background dark
          borderRadius: '8px'
        }}
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#FAFAFA" // foreground dark
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
