import { Col, Flex, Progress, Row, Statistic } from "antd";
import { AiOutlineLike } from "react-icons/ai";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactGA from "react-ga4";
import smile from "/icons/smile.svg";

export const Resume = () => {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/resume", title: "resumen" });
  }, []);

  const user = useSelector((state) => state.user);
  return (
    <div className="w-full ">
      <div className="md:p-4">
        <div className="flex items-center flex-row w-fit ">
          <h1 className="w-full">{`Bienvenid@, ${user.name}`}</h1>
          &nbsp;
          <img src={smile} className="m-0 w-[50px]" />
        </div>

        <div className="p-4 bg-[#E8E8E8] rounded-[15px] mt-8">
          <h1 className="text-[15px]">
            Tus Estadísticas (Esta sección aún está en desarrollo)
          </h1>

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
