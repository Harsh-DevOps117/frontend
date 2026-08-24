import './ArtifactViewer.css';

interface ArtifactViewerProps {
  artifact: { type: 'html' | 'markdown'; content: string };
  onClose: () => void;
}

export default function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  return (
    <div className="artifact-viewer">
      <div className="artifact-header">
        <h3 className="body-lg">Generated Artifact</h3>
        <button onClick={onClose} className="btn btn-ghost close-btn">Close</button>
      </div>
      <div className="artifact-content">
        {artifact.type === 'html' ? (
          <iframe 
            srcDoc={artifact.content} 
            sandbox="allow-scripts" 
            className="artifact-iframe"
            title="Artifact Preview"
          />
        ) : (
          <div className="markdown-preview">
            <pre>{artifact.content}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
