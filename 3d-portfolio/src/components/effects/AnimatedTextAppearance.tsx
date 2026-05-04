import { useState, useEffect } from "react"

type TextTransitionStart = {
  translateY? : number,
  translateX? : number,
  opacity? : number,
}

const AnimatedTextAppearance = ({text, timeBetweenLetters, startingState, style , delay = 0, fromLast = false} : {text : string, timeBetweenLetters : number, style? : React.CSSProperties, delay? : number, startingState ? : TextTransitionStart, fromLast? : boolean}) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
  }, [])
  const letters = [...text]

  const finalStyle = (index : number) => ({
    opacity : 1,
    transform: "translateY(0px) translateX(0px)",
    transitionDelay: `${delay + (fromLast ? letters.length - index : index) * timeBetweenLetters}s`,
  })
  const initialStyle = (index : number) =>  ({
    opacity: startingState?.opacity ?? 0,
    transform: `translateY(${-(startingState?.translateY ?? 0)}px) translateX(${-(startingState?.translateX ?? 0)}px)`,
    transitionDelay: `${delay + (fromLast ? letters.length - index : index) * timeBetweenLetters}s`,
  })
  return (
    <span style={style}>
      {letters.map((letter : string, index : number) => (
        letter === " " ? <span key={index}>&nbsp;</span> :
        <span
          key={index}
          className={`inline-block transition-all duration-500`}
          style={visible ? finalStyle(index) : initialStyle(index)}
          >
          {visible ? letter : <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

export default AnimatedTextAppearance