import React, { useEffect, useRef, useState } from "react";
import RichTextEditor from "../../../RichTextEditor";
import { Button } from "antd";
import { FiPaperclip } from "react-icons/fi";
import { RiImageAddLine } from "react-icons/ri";
import { BiImageAdd, BiImageAlt, BiImages } from "react-icons/bi";
import { useSelector } from "react-redux";
import { convertToRaw } from "draft-js";
import axios, { toFormData } from "axios";
import { MdOutlineDelete } from "react-icons/md";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const CreatePost = ({ cancelFunc, addFunc }) => {
  const user = useSelector((state) => state.user);
  const inputElement = useRef(null);
  const [sendingContent, setSendingContent] = useState(false);
  const [file, setFile] = useState(null);
  const [editorContent, setEditorContent] = useState({
    contentAsDraft: null,
    contentAsText: "",
    currentContent: null,
  });
  const [isValidContent, setIsValidContent] = useState(false);
  const handleSelectFile = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const imagenSeleccionada = event.target.files[0];
      const tiposDeImagenPermitidos = ["image/jpeg", "image/jpg", "image/png"];

      if (!tiposDeImagenPermitidos.includes(imagenSeleccionada.type)) {
        alert("Formato no válido");
        return;
      }
      const limiteDeTamañoEnBytes = 20 * 1024 * 1024;
      if (imagenSeleccionada.size > limiteDeTamañoEnBytes) {
        alert("imagen muy pesada, máx 20mb");
        return;
      } else {
        setFile(imagenSeleccionada);
        return;
      }
    }
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

  const createPostRequest = async (data) => {
    try {
      const res = await axios.post(
        `${backUrl}/api/content/createPost/${user.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Es importante establecer el encabezado Content-Type a multipart/form-data
          },
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        return res.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  //===========================================

  useEffect(() => {
    const regex = /[^\s\n]/;
    const esContenidoValido = regex.test(editorContent.contentAsText);
    if (esContenidoValido) setIsValidContent(true);
    else setIsValidContent(false);
  }, [editorContent]);

  const handleCreatePost = async (e, file) => {
    setSendingContent(true);
    //const reportNumber = reports.length + 1;

    const rawContentState = convertToRaw(editorContent.currentContent);
    const contentString = JSON.stringify(rawContentState);
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("name", `user_${user.id}_post_file`);
    formData.append("folderName", `user_${user.id}_${user.email}_content`);
    formData.append("content", contentString);

    const result = await createPostRequest(formData);
    console.log(result);
    setEditorContent(() => {
      return {
        contentAsDraft: null,
        contentAsText: "",
        currentContent: null,
      };
    });
    setSendingContent(false);
    const data = {
      User: user,
      postInfo: result.post,
    };
    addFunc(data);
    //setCreatingReport(false);
    //setScore("0");
    alert("Request finalizado");
    cancelFunc();
    return;
  };

  return (
    <div className="w-full  bg-white mb-4 md:rounded-[10px] relative shadow-md">
      <div className="w-full ">
        <RichTextEditor
          onContentChange={handleEditorContentChange}
        ></RichTextEditor>
        {sendingContent && (
          <div className="absolute  left-[0%] top-[0%]  rounded-[10px] z-10 w-full bg-[#f7f7f7] h-full flex flex-col items-center justify-center bg-opacity-80">
            <span>Subiendo Post...</span> &nbsp;{" "}
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex flex-row justify-between pr-4 pb-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleSelectFile}
            style={{ display: "none" }}
            ref={inputElement}
          />
          {!file && (
            <Button
              className="  flex items-center justify-center"
              type="link"
              icon={<BiImageAdd className="w-[25px] h-[25px]" />}
              onClick={() => {
                inputElement.current && inputElement.current.click();
              }}
            >
              Cargar
            </Button>
          )}
          {file && (
            <Button
              danger
              className="  flex items-center justify-center"
              type="link"
              icon={<MdOutlineDelete className="w-[25px] h-[25px]" />}
              onClick={() => {
                setFile(null);
              }}
            >
              Remover
            </Button>
          )}
        </div>
        <div>
          <Button
            className=" mr-2"
            danger
            type="primary"
            size="medium"
            //disabled={creatingReport}
            onClick={cancelFunc}
          >
            Cancelar
          </Button>
          <Button
            className=" "
            type="primary"
            size="medium"
            onClick={(e) => handleCreatePost(e, file)}
            //onClick={onClickSendReport}
            //disabled={creatingReport}
            disabled={!isValidContent}
          >
            Crear
          </Button>
        </div>
      </div>
      {file && (
        <div className="m-4 mt-0 p-2  bg-[#f3f3f3] rounded-[10px] max-w-[220px]">
          {" "}
          {/* Ajusta el ancho según tus necesidades */}
          <img
            src={URL.createObjectURL(file)}
            className="rounded-[7px] w-full h-auto" // Utiliza w-full para que la imagen ocupe todo el ancho disponible
          />
        </div>
      )}
    </div>
  );
};
