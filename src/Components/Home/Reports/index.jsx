import { Avatar, List, Timeline } from "antd";
import React from "react";

export const Reports = () => {
  const data = [
    {
      title: "Reporte 1",
    },
    {
      title: "Reporte 2",
    },
  ];
  return (
    <div className="w-full h-full p-4">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: "#ff7b3b",
                    verticalAlign: "middle",
                  }}
                  size="large"
                  //gap={gap}
                >
                  Luis
                </Avatar>
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description="27/05/24 - 5:00PM"
            />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
            eveniet, sapiente voluptatibus accusantium praesentium eaque,
            laboriosam aut porro officiis beatae autem natus illo unde tenetur
            explicabo veniam, cupiditate quidem at?
            <div className="p-8">
              <Timeline
                items={[
                  {
                    children: "Reporte enviado",
                  },
                  {
                    children: "Reporte revisado",
                  },
                  {
                    children: "Reunión virtual programada",
                  },
                  {
                    children: "Asistencia confirmada",
                  },
                ]}
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
