
export function InvertingDisplay(
  transitionDuration: number = 0.5,
  groupHover: boolean = true,
  scaleExtra : boolean = false,
) {
  const hoverScaleClass = scaleExtra
  ? (groupHover ? "group-hover:scale-150" : "group-hover/invert:scale-150")
  : (groupHover ? "group-hover:scale-100" : "group-hover/invert:scale-100");
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