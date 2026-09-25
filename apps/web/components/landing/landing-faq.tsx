"use client";

import { useState } from "react";

import Reveal from "./reveal";

const FAQS = [
  {
    question: "What is Beacon ?",
    answer:
      "Beacon is an open-source observability tool for AI agents. It helps you see agent executions, tool calls, LLM calls, and the flow between each step in real time.",
  },
  {
    question: "What does Beacon collect ?",
    answer:
      "Beacon collects execution telemetry such as traces, spans, nodes, timing information, and execution status so you can understand what happened during an agent run.",
  },
  {
    question: "Is Beacon OpenTelemetry compatible ?",
    answer:
      "Yes. Beacon is built around OpenTelemetry and is designed to work with telemetry generated through open standards.",
  },
  {
    question: "Can I use Beacon with my existing AI stack ?",
    answer:
      "Yes. Beacon is designed to fit into existing AI systems without requiring you to rebuild your agent architecture around it.",
  },
  {
    question: "Is Beacon open source ?",
    answer:
      "Yes. Beacon is open source and developed in the open.",
  },
  {
    question: "What can I use Beacon for ?",
    answer:
      "You can use Beacon to inspect agent executions, debug failures, understand tool and LLM behavior, identify slow steps, and monitor complex agent workflows.",
  },
];

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`h-4 w-4 transition-transform duration-300 ${
        open ? "rotate-45" : ""
      }`}
    >
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="help"
      className="relative bg-[var(--beacon-bg)] py-[clamp(88px,9vw,132px)]"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-24 lg:px-10">
        <Reveal variant="soft">
          <div className="max-w-[500px]">
            <p className="w-fit bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-[10px] font-semibold uppercase tracking-[0.22em] text-transparent dark:from-violet-300 dark:via-blue-300 dark:to-cyan-200">
              Frequently asked questions
            </p>

            <h2 className="mt-6 max-w-[430px] text-[clamp(38px,4.5vw,60px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--beacon-text)]">
              What you need to know.
            </h2>

            <p className="mt-6 max-w-[430px] text-[14px] leading-6 text-[var(--beacon-text-secondary)] sm:text-[15px]">
              A few things you might want to know before sending your first
              trace to Beacon.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <div className="overflow-hidden rounded-2xl border border-[var(--beacon-border)] bg-[var(--beacon-surface)]">
            {FAQS.map((faq, index) => {
              const open = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={
                    index !== FAQS.length - 1
                      ? "border-b border-[var(--beacon-border)]"
                      : ""
                  }
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className={`group flex w-full items-center gap-5 px-5 py-6 text-left transition-colors duration-300 sm:px-7 ${
                      open
                        ? "bg-[color-mix(in_srgb,var(--beacon-info)_4%,var(--beacon-surface))]"
                        : "hover:bg-[color-mix(in_srgb,var(--beacon-info)_3%,var(--beacon-surface))]"
                    }`}
                  >
                    <span className="w-7 shrink-0 font-mono text-[10px] font-medium tabular-nums text-[var(--beacon-info)]/70">
                      0{index + 1}
                    </span>

                    <span className="flex-1 text-[13px] font-medium text-[var(--beacon-text)] sm:text-[14px]">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                        open
                          ? "border-[color-mix(in_srgb,var(--beacon-info)_25%,var(--beacon-border))] bg-[color-mix(in_srgb,var(--beacon-info)_7%,var(--beacon-surface))] text-[var(--beacon-info)]"
                          : "border-[var(--beacon-border)] bg-[var(--beacon-bg)] text-[var(--beacon-text-muted)] group-hover:border-[color-mix(in_srgb,var(--beacon-info)_20%,var(--beacon-border))] group-hover:text-[var(--beacon-info)]"
                      }`}
                    >
                      <PlusIcon open={open} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-6 pl-[4.25rem] pr-16 text-[12px] leading-6 text-[var(--beacon-text-secondary)] sm:px-7 sm:pl-[4.75rem] sm:pr-20">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}