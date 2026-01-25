import React from 'react';

export default function Logo({ className = '', size = 24 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Proget Kart Logo"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#logoGrad)" />
      <g fill="white">
        <path
          d="M20 24h28c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H20c-1.1 0-2-.9-2-2V26c0-1.1.9-2 2-2z"
          opacity="0.9"
        />
        <circle cx="26" cy="44" r="3" fill="white" />
        <circle cx="42" cy="44" r="3" fill="white" />
        <path
          d="M18 20l-2-4H12c-.6 0-1 .4-1 1s.4 1 1 1h3.5l1.5 3"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M46 20l2-4h4c.6 0 1 .4 1 1s-.4 1-1 1h-3.5l-1.5 3"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
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
