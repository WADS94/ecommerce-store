import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faListOl,
  faListUl,
  faQuoteRight,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { RichUtils } from "draft-js";

const Toolbar = ({ editorState, setEditorState }) => {
  const tools = [
    {
      label: "bold",
      style: "BOLD",
      icon: <FontAwesomeIcon icon={faBold} />,
      method: "inline",
    },
    {
      label: "italic",
      style: "ITALIC",
      icon: <FontAwesomeIcon icon={faItalic} />,
      method: "inline",
    },
    {
      label: "underline",
      style: "UNDERLINE",
      icon: <FontAwesomeIcon icon={faUnderline} />,
      method: "inline",
    },
    {
      label: "Blockquote",
      style: "blockquote",
      icon: <FontAwesomeIcon icon={faQuoteRight} />,
      method: "block",
    },
    {
      label: "Unordered-List",
      style: "unordered-list-item",
      method: "block",
      icon: <FontAwesomeIcon icon={faListUl} />,
    },
    {
      label: "Ordered-List",
      style: "ordered-list-item",
      method: "block",
      icon: <FontAwesomeIcon icon={faListOl} />,
    },
    { label: "H1", style: "header-one", method: "block" },
    { label: "H2", style: "header-two", method: "block" },
    { label: "H3", style: "header-three", method: "block" },
    { label: "H4", style: "header-four", method: "block" },
    { label: "H5", style: "header-five", method: "block" },
    { label: "H6", style: "header-six", method: "block" },
  ];

  const applyStyle = (e, style, method) => {
    e.preventDefault();
    method === "block"
      ? setEditorState(RichUtils.toggleBlockType(editorState, style))
      : setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isActive = (style, method) => {
    if (method === "block") {
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      return blockType === style;
    } else {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    }
  };

  return (
    <div className="toolbar-grid">
      {tools.map((item, idx) => (
        <button
          style={{
            color: isActive(item.style, item.method)
              ? "rgba(0, 0, 0, 1)"
              : "rgba(0, 0, 0, 0.3)",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
