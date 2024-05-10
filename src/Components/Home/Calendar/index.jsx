import React from "react";
import calendar from "../../../assets/calendar.png";
import { Button } from "antd";
export const Calendar = () => {
  return (
    <div className="w-full h-full p-4">
      <img src={calendar} className="rounded-[15px]" />
      <Button type="link" size="large">
        Ir a google calendar
      </Button>
    </div>
  );
};
