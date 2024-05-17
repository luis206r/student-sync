import React from "react";
import TodoList from "./TodoList";
import { Collapse } from "antd";

export const Tasks = () => {
  return (
    <div className="w-full p-4 text-black">
      <h2>Mis Tareas</h2>
      <div className="w-full flex justify-center pt-6">
        <div className="">
          <TodoList />
        </div>
      </div>

      <div className="pb-4">
        <hr />{" "}
      </div>
      <div className="">
        <Collapse
          size="large"
          items={[
            {
              key: "1",
              label: "Tips",
              children: (
                <div class="container">
                  <h3>¿Por qué usar una lista de tareas?</h3>

                  <div className="p-4">
                    <p>
                      Es importante tener una lista de tareas para mantenernos
                      organizados y enfocados en nuestras actividades diarias.
                      Algunos tips para aprovechar al máximo tu lista de tareas
                      incluyen priorizar las tareas según su importancia y
                      urgencia, establecer plazos realistas, y revisar y
                      actualizar la lista regularmente. Toma en cuenta que una
                      lista de tareas bien gestionada puede ayudarte a aumentar
                      tu productividad y reducir el estrés al mantenerte al
                      tanto de tus responsabilidades.
                    </p>
                    <br />
                    <p>
                      Recuerda que también puedes usar Google Tasks, un
                      complemento de Google Calendar, en cual tambien se vincula
                      al mismo.
                    </p>
                  </div>
                </div>
              ),
            },
          ]}
        ></Collapse>
      </div>
    </div>
  );
};
