import Image from "next/image";
import Link from "next/link";

import beaconIcon from "@/app/beacon-icon.svg";

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
      <span className="relative flex shrink-0 items-center justify-center">
        <Image
          src={beaconIcon}
          alt=""
          width={config.icon}
          height={config.icon}
          priority
          className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full bg-blue-400/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>

      <span
        className={`${config.text} font-semibold leading-none tracking-[-0.02em] text-zinc-100 transition-colors duration-200 group-hover:text-white`}
      >
        Beacon
      </span>
    </Link>
  );
}