import GradientCard from "@/components/ui/GradientCard";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-2 grid h-250 lg:h-300 w-full grid-cols-4 grid-rows-4 gap-2 overflow-hidden">
      
      {/* Large feature card */}
      <GradientCard
        gradientDelay="1s"
        className="relative col-span-2 row-span-2"
      >
      <video
        className="h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/TeamVideo.mp4" type="video/mp4" />
      </video>

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-0 left-0 z-10 p-6 text-white">
          <h1 className="text-3xl font-semibold">
            Team Dashboard
          </h1>

          <p className="mt-2 max-w-md text-sm text-white/70">
            Premium cycling analytics and performance overview.
          </p>
        </div>
      </GradientCard>

      {/* Top right long cards */}
      <GradientCard
        gradientDelay="3s"
        className="col-span-2 row-span-1"
      >
        <div className="relative z-10 flex h-full items-center p-6 text-white">
          Long horizontal card
        </div>
      </GradientCard>

      <GradientCard
        gradientDelay="6s"
        className="col-span-2 row-span-1"
      >
        <div className="relative z-10 flex h-full items-center p-6 text-white">
          Another long horizontal card
        </div>
      </GradientCard>

      {/* Bottom squares */}
      <GradientCard
        gradientDelay="2s"
        className="col-span-1 row-span-1"
      >
        <div className="relative z-10 p-4 text-white">
          Square 1
        </div>
      </GradientCard>

      <GradientCard
        gradientDelay="5s"
        className="col-span-1 row-span-1"
      >
        <div className="relative z-10 p-4 text-white">
          Square 2
        </div>
      </GradientCard>

      <GradientCard
        gradientDelay="7s"
        className="col-span-1 row-span-1"
      >
        <div className="relative z-10 p-4 text-white">
          Square 3
        </div>
      </GradientCard>

      <GradientCard
        gradientDelay="9s"
        className="col-span-1 row-span-1"
      >
        <div className="relative z-10 p-4 text-white">
          Square 4
        </div>
      </GradientCard>

    </div>
  );
}