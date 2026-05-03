import { useState, useEffect } from "react"

type TextTransitionStart = {
  translateY? : number,
  translateX? : number,
  opacity? : number,
}

const AnimatedTextAppearance = ({text, timeBetweenLetters, delay = 0, startingState} : {text : string, timeBetweenLetters : number, delay? : number, startingState ? : TextTransitionStart}) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
  }, [])
  const finalStyle = (index : number) => ({
    opacity : 1,
    transform: "translateY(0px) translateX(0px)",
    transitionDelay: `${delay + index * timeBetweenLetters}s`,
  })
  const initialStyle = (index : number) =>  ({
    opacity: startingState?.opacity ?? 0,
    transform: `translateY(${-(startingState?.translateY ?? 0)}px) translateX(${-(startingState?.translateX ?? 0)}px)`,
    transitionDelay: `${delay + index * timeBetweenLetters}s`,
  })
  return (
    <span>
      {[...text].map((letter : string, index : number) => (
        letter === " " ? <span key={index}>&nbsp;</span> :
        <span
          key={index}
          className={`inline-block transition-all duration-500`}
          style={visible ? finalStyle(index) : initialStyle(index)}
          >
          {letter}
        </span>
      ))}
    </span>
  )
}

export default AnimatedTextAppearance