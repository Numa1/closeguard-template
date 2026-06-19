import { CSSProperties } from "react";

interface Props { className?: string; style?: CSSProperties; }

export default function Logo5({ className, style }: Props) {
  return (
    <svg viewBox="0 0 192 218" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M89.0601 0H191.68V102.62C135.01 102.62 89.0601 56.67 89.0601 0Z" fill="currentColor"/>
      <path d="M89.0601 114.65H191.68V217.27C135.01 217.27 89.0601 171.32 89.0601 114.65Z" fill="currentColor"/>
      <path d="M102.62 217.27H0V114.65C56.67 114.65 102.62 160.6 102.62 217.27Z" fill="currentColor"/>
      <path d="M102.62 102.63H0V0.0100098C56.67 0.0100098 102.62 45.96 102.62 102.63Z" fill="currentColor"/>
    </svg>
  );
}
