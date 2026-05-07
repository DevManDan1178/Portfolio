import { useState, useEffect, useRef } from "react"

type TextTransitionStart = {
  translateY?: number,
  translateX?: number,
  opacity?: number,
}

const AnimatedTextAppearance = ({
  text,
  timeBetweenLetters = 0.035,
  startingState = {},
  style = {},
  delay = 0,
  fromLast = false,
  appearOnlyOnce = false, 
}: {
  text: string,
  timeBetweenLetters? : number,
  style?: React.CSSProperties,
  delay?: number,
  startingState?: TextTransitionStart,
  fromLast?: boolean,
  appearOnlyOnce?: boolean,
}) => {

  const ref = useRef<HTMLSpanElement | null>(null)

  const [inView, setInView] = useState(false)
  const [hasAppeared, setHasAppeared] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting

        if (isVisible) {
          if (!hasAppeared) setHasAppeared(true)
          setInView(true)
        } else {
          if (!appearOnlyOnce) {
            setInView(false)
          }
        }
      },
      {
        threshold: 0.2,
      }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [hasAppeared, appearOnlyOnce])

  const shouldAnimate = appearOnlyOnce ? hasAppeared : inView

  const letters = [...text]

  const finalStyle = (index: number) => ({
    opacity: 1,
    transform: "translateY(0px) translateX(0px)",
    transitionDelay: `${delay + (fromLast ? letters.length - index : index) * timeBetweenLetters}s`,
  })

  const initialStyle = (index: number) => ({
    opacity: startingState?.opacity ?? 0,
    transform: `translateY(${-(startingState?.translateY ?? 0)}px) translateX(${-(startingState?.translateX ?? 0)}px)`,
    transitionDelay: `${delay + (fromLast ? letters.length - index : index) * timeBetweenLetters}s`,
  })

  return (
    <span ref={ref} style={style}>
      {letters.map((letter: string, index: number) =>
        letter === " " ? (
          <span key={index}>&nbsp;</span>
        ) : (
          <span
            key={index}
            className="inline-block transition-all duration-500"
            style={shouldAnimate ? finalStyle(index) : initialStyle(index)}
          >
            {shouldAnimate ? letter : <span>&nbsp;</span>}
          </span>
        )
      )}
    </span>
  )
}

export default AnimatedTextAppearance