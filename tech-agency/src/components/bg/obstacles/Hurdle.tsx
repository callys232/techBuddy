interface Props {
  color?: string;
}

export function Hurdle({ color = "#38BDF8" }: Props) {
  return (
    <g>
      {/* Left post */}
      <rect x="-22" y="-46" width="5" height="46" fill={color} rx="2" />
      {/* Right post */}
      <rect x="17" y="-46" width="5" height="46" fill={color} rx="2" />
      {/* Crossbar */}
      <rect x="-25" y="-50" width="50" height="8" fill={color} rx="4" />
      {/* Base feet */}
      <rect x="-34" y="-7" width="20" height="5" fill={color} opacity="0.45" rx="2" />
      <rect x="14"  y="-7" width="20" height="5" fill={color} opacity="0.45" rx="2" />
      {/* Glow line on crossbar */}
      <rect x="-25" y="-50" width="50" height="3" fill="white" opacity="0.25" rx="2" />
    </g>
  );
}
