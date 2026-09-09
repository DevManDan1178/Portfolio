import React from "react";

export default function ComingSoonCover(element: React.ReactNode) {
  return (
    <div className="relative -my-4 py-4">
      {element}

      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
        <span className="text-neutral-300/90 font-semibold text-[50px] rotate-[-5deg]">
          Coming Soon
        </span>
      </div>

    </div>
  );
}