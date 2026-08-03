"use client";

import type { SwaggerStep } from "../model/index";

const STEPS = [
  {
    key: "url",
    label: "آدرس API",
  },
  {
    key: "select",
    label: "انتخاب",
  },
  {
    key: "result",
    label: "نتیجه",
  },
] as const;

type Props = {
  current: SwaggerStep;
};

export function StepIndicator({ current }: Props) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const active = index === currentIndex;
        const done = index < currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-xs
                  font-bold

                  ${
                    done
                      ? "bg-(--lightBlue) text-white"
                      : active
                        ? "bg-(--darkBlue) text-white"
                        : "bg-slate-100 text-slate-400"
                  }
                `}
              >
                {index + 1}
              </div>

              <span
                className={`
                  text-xs

                  ${active ? "text-(--darkBlue)" : "text-slate-400"}
                `}
              >
                {step.label}
              </span>
            </div>

            {index !== STEPS.length - 1 && (
              <div className="mx-3 h-0.5 w-10 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}
