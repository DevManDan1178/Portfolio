import { useState } from "react";
import GetYoutubeEmbed from "../../components/effects/YoutubeEmbed";

const RICK_ROLL_ID = "dQw4w9WgXcQ";

const RickRoll = () => {
  const [showVideo, setShowVideo] = useState(false);

  const VideoComponent = GetYoutubeEmbed(RICK_ROLL_ID, true);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {!showVideo ? (
        <button onClick={() => setShowVideo(true)} className="text-[30px]">
          Click me?
        </button>
      ) : (
        <VideoComponent />
      )}
    </div>
  );
};

export default RickRoll;