import type { ReactNode } from "react";

type LandingContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function LandingContainer({
  children,
  className = "",
}: LandingContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}