import React, { useEffect } from "react";
//import imagen1 from "./assets/js.jpeg";
import imagen1 from "../../../assets/js.jpeg";
import imagen2 from "../../../assets/si.png";
import imagen3 from "../../../assets/foe.png";
import ReactGA from "react-ga4";

export const Events = () => {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/events", title: "eventos" });
    ReactGA.event({
      category: "Navegación",
      action: "Acceso a Eventos",
      label: "Events",
    });
  }, []);

  return (
    <div className="w-full p-4 text-black">
      <div>
        <h2>Eventos</h2>
        <div className="flex flex-wrap  justify-center">
          <div className="w-400px p-4 m-4 bg-white shadow-md rounded-[12px]">
            <img src={imagen2} style={{ width: "400px" }} />
          </div>
          <div className="w-400px p-4 m-4 bg-white shadow-md rounded-[12px]">
            <img src={imagen3} style={{ width: "400px" }} />
          </div>
          <div className="w-400px p-4 m-4 bg-white shadow-md rounded-[12px]">
            <img src={imagen1} style={{ width: "400px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};
