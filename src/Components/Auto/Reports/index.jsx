import { Avatar, Button, Collapse, List, Modal, Popover, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { MdDeleteOutline } from "react-icons/md";
import { RiQuestionFill } from "react-icons/ri";
import RichTextEditor2 from "../../RichTextEditor2";
import getTime from "../../../Utils/getTime";
import axios from "axios";
import { convertFromRaw, convertToRaw } from "draft-js";
import { useSelector } from "react-redux";

export const Reports = () => {
  const user = useSelector((state) => state.user);
  const [backRequestLoaded, setBackRequestLoaded] = useState(null);
  const [reportWasSent, setReportWasSent] = useState(false);
  const [isValidContent, setIsValidContent] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [score, setScore] = useState("0");
  const [editorContent, setEditorContent] = useState({
    contentAsDraft: null,
    contentAsText: "",
    currentContent: null,
  });
  const [creatingReport, setCreatingReport] = useState(false);
  const toggleCreatingReport = (e) => {
    e.preventDefault();
    if (!creatingReport) setReportWasSent(false);
    setCreatingReport(!creatingReport);
  };

  const handleEditorContentChange = ({
    contentAsDraft,
    contentAsText,
    currentContent,
  }) => {
    setEditorContent({
      contentAsDraft: contentAsDraft,
      contentAsText: contentAsText,
      currentContent: currentContent,
    });
  };

  const deleteReport = async (id) => {
    const result = await deleteReportBack(id);
    //console.log(result);
    const newReports = reports.filter((rep) => rep.id !== id);
    //console.log(id, newReports);
    setReports(newReports);
  };

  // const updateReports = (newReps) => {
  //   newReps.forEach((rep, i) => {
  //     rep.number = i;
  //     rep.title = "Reporte #" + (i + 1);
  //   });
  //   setReports(newReps);
  //   //console.log(newReps);
  // };

  //===========back request ===================
  const getReports = async () => {
    try {
      const res = await axios.get(
        `https://student-sync-back.onrender.com/api/reports/getReports/${user.studentInfo.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendReportToBack = async (score, content) => {
    try {
      const res = await axios.post(
        `https://student-sync-back.onrender.com/api/reports/create/${user.studentInfo.id}`,
        {
          score,
          content,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReportBack = async (reportId) => {
    try {
      const res = await axios.delete(
        `https://student-sync-back.onrender.com/api/reports/deleteReport/${reportId}`,

        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  //===========================================

  const sendReport = async (e) => {
    //const reportNumber = reports.length + 1;
    const { time, date } = getTime();
    const rawContentState = convertToRaw(editorContent.currentContent);
    const contentString = JSON.stringify(rawContentState);
    const result = await sendReportToBack(score, contentString);
    console.log(result);
    //console.log("contenido a enviar al back: ", contentString);

    setReports(() => {
      const newReport = {
        date: date,
        time: time,
        score: score,
        content: contentString, // Guardamos el contenido como string
      };
      return [...reports, newReport];
    });
    /*Enviar reporte al back... enviarlo con el raw del draft... */
    setReportWasSent(true);
    setEditorContent(() => {
      return {
        contentAsDraft: null,
        contentAsText: "",
      };
    });
    setCreatingReport(false);
    setScore("0");
  };
  const scores = [
    {
      valor: "1",
      emoji: "😞",
    },
    {
      valor: "2",
      emoji: "😐",
    },
    {
      valor: "3",
      emoji: "😬",
    },
    {
      valor: "4",
      emoji: "🙂",
    },
    {
      valor: "5",
      emoji: "😁",
    },
  ];
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getReports();

        result = result.map((res) => {
          const createdAtDate = new Date(res.createdAt);
          return {
            ...res,
            date: createdAtDate.toLocaleDateString(),
            time: createdAtDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        setReports(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    //=== tested for userId = 1 =====
    //const userReports = getUserReports(1);
    //iterar y volver a conertir a objeto el contenido
    //setUserReports(userReports);
    //===============================
    //console.log(editorContent);

    const regex = /[^\s\n]/;
    const esContenidoValido = regex.test(editorContent.contentAsText);
    if (esContenidoValido) setIsValidContent(true);
    else setIsValidContent(false);
  }, [editorContent]);
  if (user.role !== "student")
    return (
      <div>
        Por el momento, esta sección solo esta disponible para estudiantes
      </div>
    );
  else
    return (
      <div className="w-full h-full p-4 text-[black]">
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <h2>Mis reportes</h2>
            <Popover
              placement="bottomRight"
              content={
                <div className="max-w-[300px]">
                  <p>
                    - Los reportes son registros semanales en los que podrás ir
                    documentando tu avance académico
                  </p>
                  <p>
                    - Están enfocados en mejorar y percibir de mejor manera tu
                    situación académica.
                  </p>
                  <p>
                    - Solamente tu puedes ver tus reportes. Puedes verlos como
                    tu autoseguimiento
                  </p>
                  <p>
                    - Si eres alumno en riesgo académico, los miembros del área
                    de bienestar estudiantil(psicólogos) que estén vinculados a
                    tu proceso de mejora podrán tener acceso a tus reportes y
                    brindarte Feedback.
                  </p>
                </div>
              }
              title="Funcionalidad: "
            >
              <div className="flex flex-row items-center text-textcol-1">
                <RiQuestionFill className="text-[20px]" />
                <p className="">¿Qué es un reporte?</p>
              </div>
            </Popover>
          </div>

          {reports.length == 0 && (
            <div>
              <div className="pt-4">
                <div
                  className="flex
            justify-center items-center mt-8 mb-8"
                >
                  <p>Todavía no tienes reportes</p>
                </div>
              </div>
            </div>
          )}
          {/* {reportWasSent && (
          
        )} */}
          {reports.length != 0 && (
            <div className="mt-8 mb-4">
              {reports.length > 0 &&
                reports.map((report, i) => {
                  return (
                    <div
                      className="bg-white rounded-[12px] w-full pb-4 mb-4 shadow-md"
                      key={i}
                    >
                      <div className="w-full p-4 pl-6 pr-6 flex justify-between ">
                        <h3>Reporte #{i + 1}</h3>
                        <div className="w-auto m-0 flex flex-row items-center text-textcol-1">
                          <p className="text-[18px]">
                            {scores[parseInt(report.score) - 1].emoji}
                          </p>
                          &nbsp;·&nbsp;<p>{report.date}</p> &nbsp;·&nbsp;{" "}
                          <p>{report.time}</p> &nbsp;·&nbsp;{" "}
                          <Button
                            type="text"
                            shape="circle"
                            danger
                            className="flex items-center justify-center"
                            onClick={() => {
                              deleteReport(report.id);
                            }}
                          >
                            <MdDeleteOutline className="text-[25px]" />
                          </Button>
                        </div>
                      </div>
                      <hr className="ml-6 mr-6" />
                      <div className="">
                        <div className="pl-4 pr-4">
                          <RichTextEditor2
                            editorState={report.content} //el contenido es el estado en formato string
                            //onContentChange={handleEditorContentChange}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {!creatingReport && (
            <Button
              type="primary"
              size="large"
              //disabled={creatingReport}
              onClick={toggleCreatingReport}
            >
              Crear Reporte
            </Button>
          )}
          {creatingReport && !reportWasSent && (
            <div className="w-full">
              <hr />
              <h4 className="mt-2">Crear Reporte</h4>
              <div className="w-full bg-white shadow-md rounded-[12px] mt-4">
                <div>
                  <RichTextEditor onContentChange={handleEditorContentChange} />
                </div>

                <hr className="ml-6 mr-6" />

                <div className=" flex flex-row justify-end">
                  <Button
                    className="m-4 mr-0"
                    danger
                    type="primary"
                    size="medium"
                    //disabled={creatingReport}
                    onClick={toggleCreatingReport}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="m-4 mr-6"
                    type="primary"
                    size="medium"
                    onClick={() => setOpenModal(true)}
                    //onClick={onClickSendReport}
                    //disabled={creatingReport}
                    disabled={!isValidContent}
                  >
                    Crear
                  </Button>
                  <Modal
                    title="Del 1 al 5, ¿cómo calificarías esta semana?"
                    centered
                    open={openModal}
                    okText={"Crear"}
                    onOk={() => {
                      sendReport();
                      setOpenModal(false);
                    }}
                    onCancel={() => {
                      setOpenModal(false), setScore("0");
                    }}
                    okButtonProps={{ disabled: score == "0" }}
                  >
                    <div className="flex flex-row w-full justify-center items-center h-[100px]">
                      {scores.map((scr) => {
                        return (
                          <div
                            className={`${
                              parseInt(scr.valor) !== scores.length
                                ? "mr-4"
                                : ""
                            }  ${
                              scr.valor === score
                                ? "border-[1px] border-[#1677ff]"
                                : ""
                            }  rounded-[10px]`}
                          >
                            <Button
                              className="h-full"
                              type="text"
                              size="large"
                              onClick={() => setScore(scr.valor)}
                            >
                              <div>
                                <p className="text-[30px]">{scr.emoji}</p>
                                <p>{scr.valor}</p>
                              </div>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          )}
          <div className="pb-4 pt-4">
            <hr />{" "}
          </div>
          <div className="">
            <Collapse
              size="large"
              items={[
                {
                  key: "1",
                  label: "Cómo crear un reporte",
                  children: (
                    <div class="container">
                      <h2>Plantilla de reporte</h2>
                      <br />
                      <p>
                        Estas son algunas cosas que puedes incluir en tu
                        reporte:
                      </p>
                      <br />
                      <h4>Resumen de la Semana:</h4>

                      <p>
                        Esta es una descripción general de tu desempeño durante
                        la semana. Incluye información relevante y destacada.
                        Por ejemplo como sientes en general, con los cursos, con
                        tus compañeros, que crees que te falta mejorar, en que
                        sientes que estas mejorando, etc.
                      </p>
                      <br />
                      <h4>Asistencia</h4>

                      <p>
                        Puedes incluir como va tu asistencia a clases, y en caso
                        de ausencias explicar por qué se dieron.
                      </p>
                      <br />
                      <h4>Notas y Calificaciones</h4>

                      <p>
                        Puedes incluir el estado general de tus notas y
                        calificaciones, para que semanalmente vayas viendo tu
                        progreso académico.
                      </p>
                      <br />
                      <h4>Comentarios y Observaciones</h4>

                      <p>
                        Aquí puedes incluir comentarios adicionales o
                        observaciones de los profesores o cursos.
                      </p>
                      <br />
                      <h4>Plan de Acción</h4>

                      <p>
                        Basado en lo que has escrito, puedes establecer un plan
                        de acción para la siguiente semana, es decir, que harás
                        para seguir mejorando.
                      </p>
                      <br />
                      <p>
                        <b>
                          Puedes agregar más cosas que consideres relevante.
                          Recuerda que el objetivo es que puedas ver tu progreso
                          en el ciclo, tanto académico como personal 🙂.
                        </b>
                      </p>
                    </div>
                  ),
                },
              ]}
            ></Collapse>
          </div>
        </div>
      </div>
    );
};
