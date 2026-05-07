import { useState } from "react";
import GetYoutubeEmbed from "../../components/effects/YoutubeEmbed";
import SEO from "../../components/effects/SEO";

const VIDEO_ID = "NZzXzymUgEg";

const Bruh = () => {
  const [showVideo, setShowVideo] = useState(false);

  const VideoComponent = GetYoutubeEmbed(VIDEO_ID, true, 22);

  return (<>
    <SEO title="SECRET PORTFOLIO REAL" description="There's nothing to see here. Really."/>
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
  </>);
};

export default Bruh;