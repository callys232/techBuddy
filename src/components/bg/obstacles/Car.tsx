export function Car() {
  return (
    <g>
      {/* Main body */}
      <rect x="-55" y="-36" width="110" height="36" fill="#1E3A8A" rx="6" />
      {/* Cabin roof */}
      <rect x="-36" y="-62" width="72" height="30" fill="#1D4ED8" rx="8" />
      {/* Window glass */}
      <rect x="-29" y="-59" width="58" height="24" fill="#93C5FD" rx="5" opacity="0.88" />
      {/* Window tint shine */}
      <rect x="-29" y="-59" width="58" height="8" fill="white" rx="5" opacity="0.18" />
      {/* Left wheel */}
      <circle cx="-30" cy="-13" r="13" fill="#0A1628" />
      <circle cx="-30" cy="-13" r="7"  fill="#334155" />
      <circle cx="-30" cy="-13" r="3"  fill="#64748B" />
      {/* Right wheel */}
      <circle cx="30"  cy="-13" r="13" fill="#0A1628" />
      <circle cx="30"  cy="-13" r="7"  fill="#334155" />
      <circle cx="30"  cy="-13" r="3"  fill="#64748B" />
      {/* Headlight */}
      <rect x="50" y="-24" width="8" height="12" fill="#FEF9C3" rx="3" />
      <rect x="50" y="-24" width="8" height="5"  fill="white"   rx="2" opacity="0.6" />
      {/* Body accent stripe */}
      <rect x="-55" y="-14" width="110" height="4" fill="#2563EB" opacity="0.5" rx="2" />
    </g>
  );
}
