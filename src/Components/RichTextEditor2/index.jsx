import React from "react";
import { Editor, EditorState, ContentState, convertFromRaw } from "draft-js";
import "./index.css";

class RichTextEditor2 extends React.Component {
  constructor(props) {
    super(props);
    const { editorState } = props;

    // Convertir el contenido del reporte de string JSON a un objeto ContentState
    const contentState = editorState
      ? convertFromRaw(JSON.parse(editorState))
      : ContentState.createFromText(""); // Manejar el caso en que el editorState sea null

    this.state = {
      editorState: EditorState.createWithContent(contentState),
    };

    this.focus = () => this.refs.editor.focus();
  }

  render() {
    const { editorState } = this.state;

    // Si el usuario cambia el tipo de bloque antes de ingresar texto, podemos
    // ya sea aplicar estilo al marcador de posición o ocultarlo. Vamos a ocultarlo ahora.
    let className = "RichEditor-editor";
    //var contentState = editorState;
    // if (!contentState.hasText()) {
    //   if (contentState.getBlockMap().first().getType() !== "unstyled") {
    //     className += " RichEditor-hidePlaceholder";
    //   }
    // }

    return (
      <div className="TWORichEditor-root">
        <Editor
          className={"TWORichEditor-editor"}
          blockStyleFn={getBlockStyle}
          editorState={this.state.editorState}
          ref="editor"
          readOnly={true}
        />
      </div>
    );
  }
}

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

export default RichTextEditor2;
