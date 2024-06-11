import React, { useEffect, useState } from "react";
import { Input, Button, List } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { LuListPlus } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactGA from "react-ga";

const TodoList = () => {
  const user = useSelector((state) => state.user);
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() === "") {
      return;
    }
    const result = await createStudentTask(inputValue, false);
    console.log(result);
    setTodos([...todos, result]);
    setInputValue("");
    ReactGA.event({
      category: "Click",
      action: "Creación de tarea",
      label: "Tasks",
    });
  };

  const handleDeleteTodo = async (taskId) => {
    const result = await deleteStudentTask(taskId);
    console.log(result);
    setTodos(todos.filter((todo) => todo.id !== taskId));
  };

  const handleCompleteTodo = async (taskId, content) => {
    const result = await updateStudentTask(taskId, content, true);
    console.log(result);
    const updatedTodos = todos.map((todo) =>
      todo.id === taskId ? { ...todo, isCompleted: true } : todo
    );
    setTodos(updatedTodos);
  };

  //=============back requests======================

  const getStudentTasks = async () => {
    try {
      const res = await axios.get(
        `https://student-sync-back.onrender.com/api/tasks/getTasks/${user.studentInfo.id}`,
        { headers: { "Cache-Control": "no-cache" } },
        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const createStudentTask = async (content, isCompleted) => {
    try {
      const res = await axios.post(
        `https://student-sync-back.onrender.com/api/tasks/create/${user.studentInfo.id}`,
        { content: content, isCompleted: isCompleted },
        { withCredentials: true }
      );
      if (res.status === 201) return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const updateStudentTask = async (taskId, content, isCompleted) => {
    try {
      const res = await axios.put(
        `https://student-sync-back.onrender.com/api/tasks/updateTask/${taskId}`,
        { content: content, isCompleted: isCompleted },
        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudentTask = async (taskId) => {
    try {
      const res = await axios.delete(
        `https://student-sync-back.onrender.com/api/tasks/deleteTask/${taskId}`,
        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  //====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getStudentTasks();
        setTodos(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap  w-full  justify-center pt-4 pb-4">
      <div className="bg-white shadow-md md:w-[400px] w-full mb-4 p-4 rounded-[12px] flex items-center  flex-col text-black">
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
            {todos && (
              <List
                className="p-0 m-0"
                dataSource={todos.filter((todo) => !todo.isCompleted)}
                renderItem={(todo, i) => (
                  <List.Item
                    key={i}
                    className="h-[65px] flex items-center"
                    actions={[
                      <Button
                        onClick={() =>
                          handleCompleteTodo(todo.id, todo.content)
                        }
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
                        <p className="text-[15px]">{todo.content}</p>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
      {/*============================================================*/}

      <div className="md:ml-4 bg-white shadow-md md:w-[400px] w-full p-4 pb-0 rounded-[12px] flex items-center  flex-col text-black h-auto">
        <div className="w-full flex  items-center justify-center flex-col h-auto">
          <div className="p-4">
            <h2>Completado</h2>
          </div>

          <div className="w-full p-6 pb-0 pt-2">
            {todos && (
              <List
                className="p-0 m-0"
                dataSource={todos.filter((todo) => todo.isCompleted)}
                renderItem={(todo, i) => (
                  <List.Item
                    key={i}
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
                        <p className="text-[15px]">{todo.content}</p>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
