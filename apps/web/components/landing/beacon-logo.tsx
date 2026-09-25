import Image from "next/image";
import Link from "next/link";

import beaconIcon from "@/app/icon.png";

type BeaconLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: {
    icon: 30,
    text: "text-sm",
    gap: "gap-2.5",
  },
  md: {
    icon: 38,
    text: "text-base",
    gap: "gap-3",
  },
  lg: {
    icon: 48,
    text: "text-xl",
    gap: "gap-3.5",
  },
} as const;

export default function BeaconLogo({
  href = "/",
  size = "md",
}: BeaconLogoProps) {
  const config = SIZES[size];

  return (
    <Link
      href={href}
      aria-label="Beacon home"
      className={`group inline-flex items-center ${config.gap}`}
    >
      <Image
        src={beaconIcon}
        alt=""
        width={config.icon}
        height={config.icon}
        priority
        className="shrink-0 object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
      />

      <span
        className={`${config.text} font-semibold leading-none tracking-[-0.02em] text-[var(--beacon-text)]`}
      >
        Beacon
      </span>
    </Link>
  );
}