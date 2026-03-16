import Editor from "@monaco-editor/react";

function CodeEditorPanel({ code, onCodeChange }) {
  return (
    <div className="code-panel">
      <Editor
        height="100%"
        defaultLanguage="html"
        value={code}
        theme="vs-light"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false
        }}
        onChange={(value) => onCodeChange(value || "")}
      />
    </div>
  );
}

export default CodeEditorPanel;
