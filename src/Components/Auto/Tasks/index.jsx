import React from "react";
import TodoList from "./TodoList";
import { Collapse } from "antd";
import { useSelector } from "react-redux";

export const Tasks = () => {
  const user = useSelector((state) => state.user);
  if (user.role !== "student")
    return (
      <div>
        Por el momento, esta sección solo esta disponible para estudiantes
      </div>
    );
  else
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
                        Algunos tips para aprovechar al máximo tu lista de
                        tareas incluyen priorizar las tareas según su
                        importancia y urgencia, establecer plazos realistas, y
                        revisar y actualizar la lista regularmente. Toma en
                        cuenta que una lista de tareas bien gestionada puede
                        ayudarte a aumentar tu productividad y reducir el estrés
                        al mantenerte al tanto de tus responsabilidades.
                      </p>
                      <br />
                      <p>
                        Tratamos de hacer este TodoList lo mas simple posible
                        para que puedas usarlo cómodamente y sencillamente
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
