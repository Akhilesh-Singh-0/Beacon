"use client";

import { SignUp } from "@clerk/nextjs";

import AuthShell from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        forceRedirectUrl="/onboarding"
        appearance={{
          variables: {
            colorPrimary: "#8d86d8",
            colorText: "var(--beacon-text)",
            colorTextSecondary: "var(--beacon-text-secondary)",
            colorBackground: "transparent",
            colorInputBackground: "var(--beacon-bg)",
            colorInputText: "var(--beacon-text)",
            borderRadius: "0.75rem",
            fontFamily: "var(--font-geist-sans)",
          },
          elements: {
            rootBox: "w-full",
            card:
              "!w-full !overflow-hidden !border !border-[var(--beacon-border)] !bg-[var(--beacon-surface)] !shadow-[0_24px_80px_rgba(0,0,0,0.08)] dark:!shadow-[0_24px_80px_rgba(0,0,0,0.35)]",
            header:
              "gap-2",
            headerTitle:
              "text-[32px] font-semibold tracking-[-0.045em] text-[var(--beacon-text)]",
            headerSubtitle:
              "text-[15px] leading-6 text-[var(--beacon-text-secondary)]",
            logoBox:
              "h-16 w-16 rounded-2xl",
            socialButtonsBlockButton:
              "h-12 border-[var(--beacon-border)] bg-[var(--beacon-surface)] text-[var(--beacon-text)] shadow-none transition-colors hover:bg-[var(--beacon-surface-raised)]",
            socialButtonsBlockButtonText:
              "text-[14px] font-medium text-[var(--beacon-text)]",
            dividerLine:
              "bg-[var(--beacon-border)]",
            dividerText:
              "text-[12px] text-[var(--beacon-text-muted)]",
            formFieldLabel:
              "text-[13px] font-medium text-[var(--beacon-text)]",
            formFieldInput:
              "h-12 border-[var(--beacon-border)] bg-[var(--beacon-bg)] text-[14px] text-[var(--beacon-text)] shadow-none placeholder:text-[var(--beacon-text-muted)] focus:border-[var(--beacon-primary)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--beacon-primary)_25%,transparent)]",
            formFieldAction:
              "text-[12px] font-medium text-[var(--beacon-info)] hover:text-[var(--beacon-primary)]",
            formButtonPrimary:
              "h-12 border border-blue-400/30 bg-blue-500 text-[14px] font-medium text-white shadow-[0_8px_24px_rgba(37,99,235,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 dark:border-blue-400/25 dark:bg-blue-500 dark:hover:bg-blue-400",
            footer:
              "!border-t !border-[var(--beacon-border)] !bg-[var(--beacon-surface)]",
            footerActionText:
              "text-[13px] text-[var(--beacon-text-secondary)]",
            footerActionLink:
              "text-[13px] font-medium text-[var(--beacon-info)] hover:text-[var(--beacon-primary)]",
            identityPreviewEditButton:
              "text-[var(--beacon-info)]",
            alert:
              "border-[var(--beacon-border)] bg-[var(--beacon-surface-raised)] text-[var(--beacon-text)]",
          },
        }}
      />
    </AuthShell>
  );
}