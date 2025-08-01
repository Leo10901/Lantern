import React from 'react';

export default function LanternIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Top handle/ring */}
      <path d="M12 2a2 2 0 0 1 2 2v1" />
      <path d="M10 5a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
      
      {/* Top cap */}
      <path d="M8 5h8a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      
      {/* Main lantern body */}
      <path d="M8 8v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8" />
      
      {/* Glass panels - decorative arched windows */}
      <path d="M9.5 10v6a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-6" />
      <path d="M10 10a2 2 0 0 1 4 0" />
      
      {/* Flame/light inside */}
      <path d="M11 13a1 1 0 0 1 2 0c0 1-1 2-1 2s-1-1-1-2z" fill="currentColor" opacity="0.6" />
      
      {/* Bottom base */}
      <path d="M8 18h8" />
      <path d="M8.5 20h7" />
      
      {/* Side frame details */}
      <path d="M8 8v10" />
      <path d="M16 8v10" />
    </svg>
  );
}
