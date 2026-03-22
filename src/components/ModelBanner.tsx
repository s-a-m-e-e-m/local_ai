import type { LoaderState } from '../hooks/useModelLoader';

interface Props {
  state: LoaderState;
  progress: number;
  error: string | null;
  onLoad: () => void;
  label: string;
}

export function ModelBanner({ state, progress, error, onLoad, label }: Props) {
  if (state === 'ready') return null;

  return (
    <div className="model-banner">
      {state === 'idle' && (
        <>
          <span>No {label} model loaded, please invoke the model to get started.</span>
          <button className="btn btn-sm" onClick={onLoad}>Load the {label} Model</button>
        </>
      )}
      {state === 'downloading' && (
        <>
          <span>Downloading {label} model... {(progress * 100).toFixed(0)}%</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}
      {state === 'loading' && <span>Loading {label} model into engine...</span>}
      {state === 'error' && (
        <>
          <span className="error-text">Error: {error}</span>
          <button className="btn btn-sm" onClick={onLoad}>Retry</button>
        </>
      )}
    </div>
  );
}
