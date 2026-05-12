
export type HoverMode = "group" | "peer" | "invert"

export function InvertingDisplay(
  transitionDuration: number = 0.5,
  hoverMode : HoverMode = "invert",
  scaleExtra : boolean = false,
) {

  const hoverClasses = {
  group: scaleExtra
    ? "group-hover:scale-150"
    : "group-hover:scale-100",

  peer: scaleExtra
    ? "peer-hover:scale-150"
    : "peer-hover:scale-100",

  invert: scaleExtra
    ? "group-hover/invert:scale-150"
    : "group-hover/invert:scale-100",
};
  const hoverScaleClass = hoverClasses[hoverMode ?? "invert"]
  return (
    <div className={`absolute inset-0 flex items-center justify-center z-10 group/invert`}>
      <div
        className={`
          w-full h-full
          rounded-full
          backdrop-invert
          scale-0
          ${hoverScaleClass} 
          transition-all
          ease-in-out
        `}
        style={{ transitionDuration: `${transitionDuration}s` }}
      />
  </div>
  );
}