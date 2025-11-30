import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    <rect
                        x="4"
                        y="13"
                        width="24"
                        height="2"
                        fill="black"
                    />

                    {/* Coin */}
                    <g>
                        <circle
                            cx="22"
                            cy="14"
                            r="3"
                            fill="#facc15"
                        />
                        <text
                            x="22"
                            y="14"
                            dy="1.5"
                            textAnchor="middle"
                            fontSize="4.5"
                            fontWeight="bold"
                            fill="#713f12"
                            style={{
                                fontFamily: 'sans-serif',
                            }}
                        >
                            ₹
                        </text>
                    </g>
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
