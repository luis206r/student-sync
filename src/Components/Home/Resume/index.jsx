import { Col, Flex, Progress, Row, Statistic } from "antd";
import { AiOutlineLike } from "react-icons/ai";
import React from "react";

export const Resume = () => {
  return (
    <div className="w-full h-full">
      <div className="p-4">
        <h1 className="w-full text-[20px]"> Bienvenido de vuelta, Luis 🙂</h1>
        <div className="p-4 bg-[#E8E8E8] rounded-[15px] mt-8">
          <h1 className="text-[15px]">Tus Estadísticas</h1>

          <div className="p-4">
            <Flex gap="small" vertical>
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              <Progress percent={50} showInfo={false} />
            </Flex>
          </div>
          <div className="p-4">
            <Flex
              wrap
              gap="middle"
              style={{
                marginTop: 16,
              }}
            >
              <Progress
                type="dashboard"
                steps={8}
                percent={50}
                trailColor="rgba(0, 0, 0, 0.06)"
                strokeWidth={20}
              />
              <Progress
                type="circle"
                percent={100}
                steps={{
                  count: 5,
                  gap: 7,
                }}
                trailColor="rgba(0, 0, 0, 0.06)"
                strokeWidth={20}
              />
            </Flex>
          </div>
          <div className="p-4">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Feedback"
                  value={1128}
                  prefix={<AiOutlineLike />}
                />
              </Col>
              <Col span={12}>
                <Statistic title="Unmerged" value={93} suffix="/ 100" />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
