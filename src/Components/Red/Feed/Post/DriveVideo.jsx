import React from "react";

const DriveVideo = ({ fileId }) => {
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    // <div style={{ position: "relative", paddingTop: "56.25%" }}>
    //   <iframe
    //     src={embedUrl}
    //     style={{
    //       position: "absolute",
    //       top: 0,
    //       left: 0,
    //       width: "100%",
    //       height: "100%",
    //       border: "none",
    //     }}
    //     allowFullScreen
    //   />
    // </div>
    <iframe
      src={`https://drive.google.com/file/d/${fileId}/preview`}
      className="w-fit h-fit min-w-[500px] min-h-[600px]"
      allow="autoplay"
    ></iframe>
  );
};

export default DriveVideo;
