import type { ReactNode } from "react"

function GetYoutubeEmbedComponent(videoId : string, autoplay = true, startTime = 0) : () => (ReactNode) {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&start=${startTime}`

  return function VideoComponent() {
    return (
      <iframe
        width="560"
        height="315"
        src={src}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    )
  }
}

export default GetYoutubeEmbedComponent;