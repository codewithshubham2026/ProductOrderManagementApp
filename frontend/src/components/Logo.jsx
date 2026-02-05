// Import React library
import React from 'react';

// Logo component: renders the application logo as an SVG
// className: optional CSS class to apply custom styling
// size: optional size of the logo in pixels (default: 24)
export default function Logo({ className = '', size = 24 }) {
  return (
    // SVG element: scalable vector graphic for the logo
    <svg
      // viewBox defines the coordinate system and aspect ratio
      viewBox="0 0 64 64"
      // width and height set the actual display size
      width={size}
      height={size}
      // Apply custom className if provided
      className={className}
      // Accessibility: indicate this is an image
      role="img"
      // Accessibility: provide descriptive label for screen readers
      aria-label="Proget Kart Logo"
    >
      {/* SVG definitions section: reusable elements like gradients */}
      <defs>
        {/* Linear gradient definition: creates gradient from indigo to purple */}
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          {/* Gradient stop at 0%: indigo color (#6366f1) */}
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          {/* Gradient stop at 100%: purple color (#8b5cf6) */}
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* Background rectangle with rounded corners, filled with gradient */}
      <rect width="64" height="64" rx="14" fill="url(#logoGrad)" />
      {/* Group element containing all white logo elements */}
      <g fill="white">
        {/* Shopping cart body: rectangle representing the cart container */}
        <path
          d="M20 24h28c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H20c-1.1 0-2-.9-2-2V26c0-1.1.9-2 2-2z"
          opacity="0.9"
        />
        {/* Left wheel of the shopping cart */}
        <circle cx="26" cy="44" r="3" fill="white" />
        {/* Right wheel of the shopping cart */}
        <circle cx="42" cy="44" r="3" fill="white" />
        {/* Left handle of the shopping cart */}
        <path
          d="M18 20l-2-4H12c-.6 0-1 .4-1 1s.4 1 1 1h3.5l1.5 3"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Right handle of the shopping cart */}
        <path
          d="M46 20l2-4h4c.6 0 1 .4 1 1s-.4 1-1 1h-3.5l-1.5 3"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Vertical line in center (cart divider or decorative element) */}
        <path
          d="M32 16v8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
