import React, { useState } from "react";
import { Input, Button, List } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { LuListPlus } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

const TodoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }
    setTodos([
      ...todos,
      { id: Date.now(), text: inputValue, isCompleted: false },
    ]);
    setInputValue("");
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleCompleteTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="flex flex-wrap pt-4 pb-4">
      <div className="bg-white shadow-md w-[400px] mb-4 p-4 rounded-[12px] flex items-center  flex-col text-black">
        <div className="w-full flex items-center justify-center flex-col h-auto">
          <div className="p-4">
            {/* <LuListPlus className="text-[30px] p-0 mt-[4px] mr-2" /> */}
            <h2>Por hacer</h2>
          </div>

          <div className="w-full p-4 flex items-center">
            <Input
              size="large"
              placeholder="Ingresa una tarea..."
              value={inputValue}
              onChange={handleInputChange}
              className="m-0"
              onKeyDown={(e) => {
                return e.keyCode === 13 ? handleAddTodo() : null;
              }}
            />
            <Button
              type="primary"
              shape="circle"
              size="large"
              onClick={handleAddTodo}
              className="ml-2 flex items-center justify-center"
            >
              <IoMdAdd className="text-[22px]" />
            </Button>
          </div>

          <div className="w-full p-6 pb-0 pt-2">
            <List
              className="p-0 m-0"
              dataSource={todos.filter((todo) => !todo.isCompleted)}
              renderItem={(todo) => (
                <List.Item
                  className="h-[65px] flex items-center"
                  actions={[
                    <Button
                      onClick={() => handleCompleteTodo(todo.id)}
                      type="link"
                      size="small"
                      shape="circle"
                      className="flex justify-end items-center p-0 m-0"
                    >
                      <IoMdCheckboxOutline className="m-0 p-0 text-[20px]" />
                    </Button>,
                    <Button
                      onClick={() => handleDeleteTodo(todo.id)}
                      type="link"
                      size="small"
                      shape="circle"
                      danger
                      className="flex justify-end items-center"
                    >
                      <MdDeleteOutline className="m-0 p-0 text-[21px]" />
                    </Button>,
                  ]}
                >
                  <div className="flex">
                    <div className="flex items-start h-full">
                      <TbPointFilled className="p-0 mt-[6px] mr-2 m-0" />
                    </div>
                    <div>
                      <p className="text-[15px]">{todo.text}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
      {/*============================================================*/}
      <div>
        <div className="ml-4 bg-white shadow-md w-[400px] p-4 pb-0 rounded-[12px] flex items-center  flex-col text-black h-auto">
          <div className="w-full flex  items-center justify-center flex-col h-auto">
            <div className="p-4">
              <h2>Completado</h2>
            </div>

            <div className="w-full p-6 pb-0 pt-2">
              <List
                className="p-0 m-0"
                dataSource={todos.filter((todo) => todo.isCompleted)}
                renderItem={(todo) => (
                  <List.Item
                    actions={[
                      <Button
                        onClick={() => handleDeleteTodo(todo.id)}
                        type="link"
                        size="large"
                        shape="circle"
                        danger
                        className="flex justify-end items-center"
                      >
                        <MdDeleteOutline className="m-0 p-0 text-[20px]" />
                      </Button>,
                    ]}
                  >
                    <div className="flex  h-full">
                      <div className="flex items-start h-full">
                        <FaCheck className="p-0 mt-[6px] mr-3 m-0" />
                      </div>
                      <div>
                        <p className="text-[15px]">{todo.text}</p>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
