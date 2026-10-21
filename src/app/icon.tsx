import { ImageResponse } from "next/og";

// Browser tab icon: a "T" on the stage with the indigo dot. Replaces Next's default favicon.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050507",
          borderRadius: 7,
          color: "#f5f5f7",
          fontSize: 22,
          fontWeight: 700,
          position: "relative",
        }}
      >
        T
        <div
          style={{
            position: "absolute",
            right: 5,
            bottom: 6,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: "#6366f1",
          }}
        />
      </div>
    ),
    size,
  );
}
