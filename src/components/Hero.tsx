// src/components/Hero.tsx
import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      className="text-center relative w-full rounded-lg overflow-hidden shadow-sm mb-6"
      aria-label="Hero"
    >
      <div className="flex flex-col items-center justify-center bg-[url(./assets/hero-bg.jpg)] bg-cover bg-center bg-opacity-40 p-8 md:p-12 text-white min-h-[250px]">
      <h2 className="text-2xl md:text-4xl font-bold text-center">Mine Safety & Incident Tracker</h2>
      <p className="mt-2 max-w-2xl text-center">
        Log incidents, visualize risk, and take action — all in one intuitive dashboard built for mining teams.
      </p>
      </div>
    </section>
  );
};

export default Hero;
