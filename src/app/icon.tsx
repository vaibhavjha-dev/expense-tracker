import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Card (Back layer) */}
          <rect
            x="6"
            y="3"
            width="20"
            height="14"
            rx="2"
            fill="#333333"
            fillOpacity="0.4"
          />

          {/* Wallet Body (Front layer) */}
          <path
            d="M4 12C4 9.79086 5.79086 8 8 8H24C26.2091 8 28 9.79086 28 12V24C28 26.2091 26.2091 28 24 28H8C5.79086 28 4 26.2091 4 24V12Z"
            fill="#855D3E"
          />

          {/* Strip */}
          <rect x="4" y="13" width="24" height="2" fill="black" />

          {/* Coin with Rupee Symbol */}
          <g>
            <circle cx="22" cy="14" r="3" fill="#facc15" />
            {/* Rupee symbol as path */}
            <path
              d="M20.5 12.5L23.5 12.5M20.5 13L23.5 13M21.2 13.8C21.2 13.2 21.7 12.8 22.2 12.8C22.9 12.8 23.4 13.3 23.4 14C23.4 14.7 22.9 15.2 22.2 15.2C21.7 15.2 21.2 14.8 21.2 14.2M21.5 15.2L23.2 16"
              stroke="#713f12"
              strokeWidth="0.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
