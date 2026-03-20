import Editor from "@monaco-editor/react";

function CodeEditorPanel({ code, onCodeChange }) {
  return (
    <div className="code-panel">
      <Editor
        height="100%"
        defaultLanguage="html"
        value={code}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          padding: { top: 18 }
        }}
        onChange={(value) => onCodeChange(value || "")}
      />
    </div>
  );
}

export default CodeEditorPanel;
