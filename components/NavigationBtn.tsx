import React from "react";

interface NavigationBtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  size?: number; // px, default 48
}

export default function NavigationBtn({
  onClick,
  children,
  className = "",
  style = {},
  ariaLabel,
  size = 48,
}: NavigationBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(137deg, rgba(255,255,255,0.15) 0%, rgba(113,113,113,0.12) 95%)',
        boxShadow: '0px 0.889px 21.34px -0.889px rgba(0,0,0,0.18)',
        borderRadius: '44.45px',
        outline: '1px rgba(255,255,255,0.10) solid',
        outlineOffset: '-1px',
        backdropFilter: 'blur(10.67px)',
        WebkitBackdropFilter: 'blur(10.67px)',
        ...style,
      }}
    >
      {children}
    </button>
  );
} 