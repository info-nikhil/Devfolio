function PreviewPanel({ htmlCode, iframeRef }) {
  return (
    <div className="preview-panel">
      <iframe
        ref={iframeRef}
        title="Portfolio Preview"
        srcDoc={htmlCode}
        className="preview-frame"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}

export default PreviewPanel;
