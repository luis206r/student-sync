import React from "react";

const InstagramEmbed = ({ url }) => {
  const embedUrl = `https://www.instagram.com/p/${getInstagramPostId(
    url
  )}/embed/`;

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <iframe
        src={embedUrl}
        width="400"
        height="500"
        frameborder="0"
        scrolling="no"
        allowtransparency="true"
        style={{ border: "none", overflow: "hidden" }}
      ></iframe>
    </div>
  );
};

function getInstagramPostId(url) {
  // Función para extraer el ID de la publicación de Instagram desde el URL
  const match = url.match(/\/p\/([^\/?]+)/);
  return match ? match[1] : "";
}

export default InstagramEmbed;
