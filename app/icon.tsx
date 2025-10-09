import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDB022",
      }}
    >
      {/* Hive hexagon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
        }}
      >
        {/* Main hive body */}
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />

        {/* Hexagon pattern */}
        <polygon points="50,25 60,30 60,40 50,45 40,40 40,30" fill="#FDB022" opacity="0.6" />
        <polygon points="35,35 45,40 45,50 35,55 25,50 25,40" fill="#FDB022" opacity="0.6" />
        <polygon points="65,35 75,40 75,50 65,55 55,50 55,40" fill="#FDB022" opacity="0.6" />

        {/* Entrance hole */}
        <circle cx="70" cy="70" r="8" fill="#92400E" />

        {/* Bee */}
        <g transform="translate(75, 75)">
          {/* Bee body */}
          <ellipse cx="0" cy="0" rx="6" ry="4" fill="#1F2937" />
          <ellipse cx="-2" cy="0" rx="3" ry="2.5" fill="#FDB022" />
          <ellipse cx="2" cy="0" rx="3" ry="2.5" fill="#1F2937" />

          {/* Bee wings */}
          <ellipse cx="-3" cy="-2" rx="4" ry="2" fill="white" opacity="0.7" />
          <ellipse cx="1" cy="-2" rx="4" ry="2" fill="white" opacity="0.7" />
        </g>
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
