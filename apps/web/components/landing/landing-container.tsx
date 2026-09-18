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
      className={className}
      style={{
        width: "100%",
        maxWidth: "1440px",
        marginInline: "auto",
        paddingInline: "clamp(16px, 3vw, 32px)",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}