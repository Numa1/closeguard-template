interface AnimatedWaveIconProps {
  className?: string;
}

const styles = `
@keyframes cg-wave {
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
}
.cg-wave-bar {
  transform-box: fill-box;
  transform-origin: center;
  animation: cg-wave 1.1s ease-in-out infinite;
}
.cg-wave-bar:nth-child(2) { animation-delay: 0.15s; }
.cg-wave-bar:nth-child(3) { animation-delay: 0.3s; }
.cg-wave-bar:nth-child(4) { animation-delay: 0.45s; }
`;

export default function AnimatedWaveIcon({ className }: AnimatedWaveIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <rect className="cg-wave-bar" x="2.5" y="2" width="2.6" height="16" rx="1.3" />
      <rect className="cg-wave-bar" x="6.9" y="2" width="2.6" height="16" rx="1.3" />
      <rect className="cg-wave-bar" x="11.3" y="2" width="2.6" height="16" rx="1.3" />
      <rect className="cg-wave-bar" x="15.7" y="2" width="2.6" height="16" rx="1.3" />
    </svg>
  );
}
