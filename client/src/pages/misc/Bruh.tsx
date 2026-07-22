import { useState } from "react";
import GetYoutubeEmbedComponent from "../../components/effects/YoutubeEmbed";
import SEO from "../../components/misc/SEO";

const VIDEO_ID = "NZzXzymUgEg";

const Bruh = () => {
  const [showVideo, setShowVideo] = useState(false);
  const getVideoComponent = GetYoutubeEmbedComponent(VIDEO_ID, true, 22)
  const video  = getVideoComponent();
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
        video
      )}
    </div>
  </>);
};

export default Bruh;