import React from "react";
import { Editor, EditorState } from "draft-js";
import "./index.css";

class RichTextEditor2 extends React.Component {
  constructor(props) {
    super(props);
    const { editorState } = props;

    this.state = {
      editorState: EditorState.createWithContent(
        editorState.getCurrentContent()
      ),
    };

    this.focus = () => this.refs.editor.focus();
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="RichEditor-root2">
        <div className={className}>
          <Editor
            className={"RichEditor-editor2"}
            blockStyleFn={getBlockStyle}
            editorState={this.state.editorState}
            ref="editor"
            readOnly={true}
          />
        </div>
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
