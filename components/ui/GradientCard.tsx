"use client";

import { useEffect, useRef, useState } from "react";

type GradientCardProps = {
  gradientDelay?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function GradientCard({
  gradientDelay = "0s",
  children,
  className,
}: GradientCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [box, setBox] = useState({
    size: 0,
    centerX: 0,
    centerY: 0,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      const size = Math.sqrt(rect.width * rect.width + rect.height * rect.height) + 4;

      setBox((prev) => {
        const next = {
          size,
          centerX: size / 2 - rect.width / 2,
          centerY: size / 2 - rect.height / 2,
        };

        if (
          prev.size === next.size &&
          prev.centerX === next.centerX &&
          prev.centerY === next.centerY
        ) {
          return prev;
        }

        return next;
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-xl ${className || ""}`}
    >
      <div
        className="absolute"
        style={{
          width: box.size,
          height: box.size,
          transform: `translate(-${box.centerX}px, -${box.centerY}px)`,
        }}
      >
        <div
          className="h-full w-full will-change-transform animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,#3b82f6,#9333ea,#ec4899,#f59e0b,#3b82f6)]"
          style={{ animationDelay: `-${gradientDelay}` }}
        />
      </div>

      <div className="relative h-full w-full p-[2px]">
        <div className="relative h-full w-full overflow-hidden rounded-[calc(0.75rem-2px)] bg-black">
          {children}
        </div>
      </div>
    </div>
  );
}