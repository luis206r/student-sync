import React, { useEffect, useRef, useState } from "react";
import calendar from "../../../assets/calendar.png";
import {
  Button,
  Collapse,
  Popover,
  Space,
  DatePicker,
  Input,
  Checkbox,
  TimePicker,
  Modal,
} from "antd";
import { RiQuestionFill } from "react-icons/ri";
import { IoMdRefresh } from "react-icons/io";
import { BsWindowSidebar } from "react-icons/bs";
import { useSelector } from "react-redux";
const { RangePicker } = DatePicker;
import ReactGA from "react-ga";

export const Calendar = () => {
  const user = useSelector((state) => state.user);
  const [event, setEvent] = useState({ title: "", place: "", daysToRep: "" });
  const [dayOptions, setDayOptions] = useState([
    {
      label: "Do",
      value: "SU",
      enabled: false,
      disabled: false,
    },
    {
      label: "Lu",
      value: "MO",
      enabled: false,
      disabled: false,
    },
    {
      label: "Ma",
      value: "TU",
      enabled: false,
      disabled: false,
    },
    {
      label: "Mi",
      value: "WE",
      enabled: false,
      disabled: false,
    },
    {
      label: "Ju",
      value: "TH",
      enabled: false,
      disabled: false,
    },
    {
      label: "Vi",
      value: "FR",
      enabled: false,
      disabled: false,
    },
    {
      label: "Sa",
      value: "SA",
      enabled: false,
      disabled: false,
    },
  ]);
  const saveButtonCode = "xSaveBu";
  const iframeRef = useRef();
  const [showReps, setShowReps] = useState(false);

  const error = () => {
    Modal.error({
      title: "Rellena todos los campos",
      content: "completa los campos para poder crear el evento",
    });
  };

  const onChangeCheckboxValue = (e, i) => {
    console.log(i);
    setDayOptions(() => {
      let daysCopy = dayOptions;
      daysCopy[parseInt(i)].enabled = e.target.checked;
      return daysCopy;
    });
  };

  const onChangeDateEventValues = (date, dateString, key) => {
    //console.log(date.$W)

    if (key == "day")
      setDayOptions(() => {
        let daysCopy = dayOptions.map((day) => {
          return {
            ...day,
            enabled: false,
            disabled: false,
          };
        });
        if (dateString != "") {
          daysCopy[0 + date.$W].enabled = true;
          daysCopy[0 + date.$W].disabled = true;
        }
        return daysCopy;
      });
    setEvent({ ...event, [key]: dateString });
  };

  const onChangeTimeEventValues = (timeString, key) => {
    setEvent({ ...event, [key]: timeString });
  };

  const onChangeInputEventValues = (key, e) => {
    setEvent({ ...event, [key]: e.target.value });
  };

  const createEvent = (e) => {
    e.preventDefault();
    if (
      event.title == "" ||
      event.place == "" ||
      !event.day ||
      event.day == "" ||
      !event.startTime ||
      event.startTime == "" ||
      !event.finalTime ||
      event.finalTime == "" ||
      (showReps && (!event.lastDayRep || event.lastDayRep == ""))
    )
      error();
    else {
      console.log("enviar");
      let eventCopy = event;
      eventCopy.title = eventCopy.title.trim().replace(/\s+/g, "+");
      eventCopy.place = eventCopy.place.trim().replace(/\s+/g, "+");
      eventCopy.day = event.day.replace(/-/g, "");
      const adjustTime = (time) => {
        let h = time;
        if (h.includes("am")) {
          if (h.substring(0, 2) == "12") h = "00" + h.substring(2, h.length);
          else h = "0" + h;
          h = h.split(" ")[0];
          let h_1 = h.split(":")[0];
          let h_2 = h.split(":")[1];
          h = `${h_1}${h_2}00`;
          //eventCopy.startTime = hi;
        } else if (h.includes("pm")) {
          h = h.split(" ")[0];
          let h_1 = h.split(":")[0];
          let h_2 = h.split(":")[1];
          h_1 = `${12 + parseInt(h_1)}`;
          h = `${h_1}${h_2}00`;
          //eventCopy.finalTime = hf;
        }
        return h;
      };
      eventCopy.startTime = adjustTime(eventCopy.startTime);
      eventCopy.finalTime = adjustTime(eventCopy.finalTime);
      [];

      let urlParams = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventCopy.title}+-+${eventCopy.place}&details=Recuerda+cambiar+el+color.+☝️&dates=${eventCopy.day}T${eventCopy.startTime}/${eventCopy.day}T${eventCopy.finalTime}&ctz=America/Lima`;
      if (showReps) {
        eventCopy.lastDayRep = eventCopy.lastDayRep.replace(/-/g, "");
        eventCopy.daysToRep = "";
        dayOptions.map((day) => {
          eventCopy.daysToRep += day.enabled ? day.value + "," : "";
        });
        eventCopy.daysToRep = eventCopy.daysToRep.substring(
          0,
          eventCopy.daysToRep.length - 1
        );
        urlParams += `&recur=RRULE:FREQ=WEEKLY;BYDAY=${eventCopy.daysToRep};UNTIL%3D${eventCopy.lastDayRep}`;
      }
      console.log(urlParams);
      window.open(urlParams, "_blank");
      ReactGA.event({
        category: "Click",
        action: "Creación de evento",
        label: "Calendar",
      });
    }
  };

  useEffect(() => {
    console.log(event);
  }, [event]);

  useEffect(() => {
    console.log(dayOptions);
  }, [dayOptions]);

  // const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Nuevo+Evento+Student+Collab+🙂&details=Recuerda+cambiar+el+título+☝️&dates=${year}${month}${day}T${hora_inicio}0000/${year}${month}${day}T${hora_fin}0000&recur=RRULE:FREQ%3DWEEKLY;UNTIL%3D20210603&ctz=America/Lima`

  const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Nuevo+Evento+Student+Collab+🙂&details=Recuerda+cambiar+el+título.+Ejemplo+Base+de+Datos+2+-+A904.+Tambien+recuerda+cambiar+el+color.+☝️&dates=20240611T120000/20240611T130000&ctz=America/Lima`;

  const testhndl = (key) => {
    if (key[0])
      ReactGA.event({
        category: "Click",
        action: "Visualización de guía de Calendario",
        label: "Calendar",
      });
  };

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
    ReactGA.event({
      category: "Navegación",
      action: "Acceso a Calendario",
      label: "Calendar",
    });
  }, []);

  return (
    <div className="w-full h-full md:p-4">
      <div>
        <h2 className="text-black">Mi Calendario</h2>
      </div>
      <div className="bg-white p-4 pt-0 mb-4 mt-4 rounded-[12px] shadow-md">
        <div className="w-full flex justify-between mb-0 mt-1">
          <div className="flex items-center">
            <Button
              type="link"
              shape="circle"
              size="small"
              className="pl-0 flex text-[20px] items-center"
              onClick={(e) => (iframeRef.current.src += "")}
            >
              <IoMdRefresh />
            </Button>

            <Button type="link" size="large" className="pl-2">
              Ir a google calendar
            </Button>
          </div>

          <Popover
            placement="bottomRight"
            content={
              <div className="md:w-[300px] w-[250px]">
                <p>
                  <b>*Usuarios recien registrados:*</b>
                </p>
                <p>
                  En caso recién te hayas registrado, estaremos habilitando tu
                  inicio de sesión con google en los próximos días. Una vez
                  habilitado, podrás acceder con tu cuenta de google y
                  solicitaremos permisos para acceder a tu calendario e
                  información de usuario.
                </p>
                <hr className="mt-2 mb-2" />
                <p>- Es posible que sea necesario volver a inciar sesión.</p>

                <p>
                  - Toma en cuenta que se cargan los eventos asociados a tu
                  cuenta de UTEC
                </p>
              </div>
            }
          >
            <div className="flex flex-row items-center">
              <RiQuestionFill className="text-[20px]" />
              <p className="hidden md:flex">¿No puedes ver tus eventos?</p>
            </div>
          </Popover>
        </div>
        <div className="w-full p-4 bg-[#e3e9ff] rounded-[10px] ">
          <iframe
            ref={iframeRef}
            src={`https://calendar.google.com/calendar/embed?src=${user.email.replace(
              "@",
              "%40"
            )}&ctz=America%2FLima&bgcolor=%23e3e9ff&mode=WEEK`}
            style={{
              style: "border: 0",
              width: "100%",
              height: "700px",
              frameborder: "0",
              //scrolling: "no",
            }}
          ></iframe>
        </div>
      </div>
      {/* <img src={calendar} className="rounded-[15px]" /> */}
      <hr />
      <div className="pt-4">
        <Collapse
          onChange={testhndl}
          size="large"
          items={[
            {
              key: "1",
              label: "Cómo usar Google Calendar",
              children: (
                <div>
                  <h1 className="text-[20px]">
                    Te ayudaremos a crear un evento
                  </h1>
                  <div className="p-4">
                    <p>
                      En Google Calendar puedes crear distintos tipos de
                      eventos. Por ejemplo, para crear un horario de algún
                      curso, necesitas que un evento, por ejemplo "clase de
                      algoritmos el Lunes en el salón X desde tal hora a tal
                      hora", se repita semanalmente todos los días Lunes hasta
                      la última semana de clases. Por lo tanto, tienes que hacer
                      lo siguiente:
                    </p>
                    <br />
                    <p>1. Definir el nombre del evento</p>
                    <p>2. Definir la hora de inicio y fin</p>
                    <p>3. Definir el día</p>
                    <p>5. Definir la ubicación</p>
                    <p>6. Definir la frecuencia (en este caso semanalmente)</p>
                    <br />
                    <p>
                      En caso de que tengas el mismo curso otro día en la misma
                      semana, a la misma hora y mismo salón, puedes repetir
                      semanalmente el evento hasta una fecha determinada(e.g.
                      fin de ciclo)
                    </p>
                    <br />
                    <p>
                      En caso de que tengas el mismo curso otro día en la misma
                      semana, pero en distinto horario o salón, tendrías que
                      repetir los pasos anteriores.
                    </p>
                  </div>
                  <div>
                    <h1 className="text-[20px]">Crear evento</h1>
                    <div className="p-4 flex flex-wrap">
                      <div className="pr-4 pb-4">
                        <p>Nombre</p>
                        <Input
                          size="large"
                          placeholder="e.g. Clase Cálculo 1"
                          type="text"
                          onChange={(e) => onChangeInputEventValues("title", e)}
                        />
                      </div>
                      <div className="pr-4 pb-4">
                        <p>Lugar</p>
                        <Input
                          size="large"
                          placeholder="e.g. A904"
                          type="text"
                          onChange={(e) => onChangeInputEventValues("place", e)}
                        />
                      </div>

                      <div className="pr-4 pb-4">
                        <p>Fecha</p>
                        <Space direction="vertical" size={12}>
                          <DatePicker
                            size={"large"}
                            onChange={(date, dateString) =>
                              onChangeDateEventValues(date, dateString, "day")
                            }
                          />
                        </Space>
                      </div>

                      <div className="pr-4 pb-4">
                        <p>Inicio</p>
                        <Space direction="vertical" size={12}>
                          <TimePicker
                            use12Hours
                            format="h:mm a"
                            size={"large"}
                            onChange={(time, timeString) =>
                              onChangeTimeEventValues(timeString, "startTime")
                            }
                          />
                        </Space>
                      </div>

                      <div className="pr-4 pb-4">
                        <p>Fin</p>
                        <Space direction="vertical" size={12}>
                          <TimePicker
                            use12Hours
                            format="h:mm a"
                            size={"large"}
                            onChange={(time, timeString) =>
                              onChangeTimeEventValues(timeString, "finalTime")
                            }
                          />
                        </Space>
                      </div>
                    </div>
                    <div className="pl-4">
                      <Checkbox onChange={(e) => setShowReps(e.target.checked)}>
                        ¿Repetir semanalmente?
                      </Checkbox>
                    </div>
                    {showReps && (
                      <div className="p-4 pl-8 flex flex-wrap">
                        <div className="pr-4 pb-4">
                          <p>Días</p>
                          <div className="flex flex-row ">
                            {dayOptions.map((day, i) => {
                              return (
                                <Checkbox
                                  key={i}
                                  {...(day.disabled ? { checked: true } : {})}
                                  disabled={day.disabled}
                                  onChange={(e) => onChangeCheckboxValue(e, i)}
                                >
                                  {day.label}
                                </Checkbox>
                              );
                            })}
                          </div>
                        </div>
                        <div className="pr-4 pb-4">
                          <p>Finaliza</p>
                          <DatePicker
                            size={"large"}
                            picker="day"
                            onChange={(date, dateString) =>
                              onChangeDateEventValues(
                                date,
                                dateString,
                                "lastDayRep"
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <p>
                        Estas son solo algunas opciones que puedes considerar al
                        momento de crear un evento en Google Calendar. Toma en
                        cuenta que en la propia página puedes modificar y
                        agregar más configuraciones a tu evento. Por ejemplo
                        puedes asignarle un color distinto a los eventos de cada
                        curso, agregar alguna alerta antes de cada evento, entre
                        otras cosas.
                      </p>
                      <p>
                        <b>
                          Al crear el evento te enviaremos a la página de Google
                          Calendar, y cargaremos una plantilla de creación de
                          evento con los datos que has ingresado ahora. Lo único
                          que tienes que hacer es guardar el evento dándole
                          click al botón guardar. Recuerda que el objetivo es
                          que aprendas a usar Google Calendar 🙂.
                        </b>
                      </p>
                    </div>
                    <div className="p-4">
                      <Button type="primary" size="large" onClick={createEvent}>
                        Crear
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
