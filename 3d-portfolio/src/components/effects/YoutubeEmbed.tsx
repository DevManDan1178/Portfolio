import type { ReactElement } from "react";

function GetYoutubeEmbed(videoId : string, autoplay = true) : () => (ReactElement) {
  return () => (
    <div>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}${autoplay && "?autoplay=1"}`}
        title="YouTube video player"
        frameBorder="0"
        allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
        allowFullScreen
      />
    </div>
  );
};

export default GetYoutubeEmbed;