import { Navbar } from "@/components/Navbar";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: 'url("/tree1.png")', // Add your background image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Optional overlay
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
