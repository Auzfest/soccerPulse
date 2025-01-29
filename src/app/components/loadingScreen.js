"use client";
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
    </div>
  );
}
