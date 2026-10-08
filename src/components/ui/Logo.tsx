/* TechBuddy logo mark — cropped from public/logo.png (the real uploaded
   asset, transparent PNG) to its actual content bounds so it sizes cleanly
   at navbar/footer scale. See public/logo-mark.png for the crop.
*/

import Image from "next/image";

interface Props {
  size?:      "sm" | "md" | "lg";
  className?: string;
}

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-5",
  md: "h-7",
  lg: "h-10",
};

export function CatalystTechLogo({ size = "md", className = "" }: Props) {
  return (
    <Image
      src="/logo-mark.png"
      alt="TechBuddy"
      width={1600}
      height={577}
      priority
      className={["w-auto select-none", SIZE[size], className].join(" ")}
    />
  );
}
