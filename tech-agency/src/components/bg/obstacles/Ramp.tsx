export function Ramp() {
  return (
    <g>
      {/* Ramp body */}
      <polygon points="-65,0 65,0 65,-40" fill="#1E3A8A" opacity="0.9" />
      {/* Surface edge */}
      <line x1="-65" y1="0" x2="65" y2="-40"
        stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      {/* Launch arrow */}
      <line x1="-15" y1="-14" x2="30" y2="-28"
        stroke="#38BDF8" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <polygon points="30,-28 22,-20 36,-24" fill="#38BDF8" opacity="0.5" />
      {/* Ground base */}
      <rect x="-65" y="-4" width="130" height="4" fill="#1D4ED8" opacity="0.4" rx="2" />
    </g>
  );
}
