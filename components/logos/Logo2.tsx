import { CSSProperties } from "react";

interface Props { className?: string; style?: CSSProperties; }

export default function Logo2({ className, style }: Props) {
  return (
    <svg viewBox="0 0 374 332" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M123.72 249.155C94.8279 283.41 23.3786 282.962 56.5319 195.196C89.6851 107.43 98.371 99.5957 109.987 82.8387C121.603 66.0817 143.262 45.1527 180.093 40.4682C216.923 35.7836 263.155 62.6168 263.155 62.6168C263.155 62.6168 315.943 87.3429 349.771 163.694C383.6 240.045 313.428 276.576 267.12 231.569L232.567 197.983C218.692 184.499 201.151 179.435 185.822 184.489C178.932 186.761 172.784 190.988 167.837 196.854L123.72 249.155Z" fill="currentColor"/>
      <ellipse cx="202.143" cy="237.896" rx="25.5811" ry="32.0686" transform="rotate(-2.17767 202.143 237.896)" fill="currentColor"/>
    </svg>
  );
}
