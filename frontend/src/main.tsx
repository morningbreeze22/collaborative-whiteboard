import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Stagewise Toolbar Integration (Development Only)
if (import.meta.env.DEV) {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = {
      plugins: []
    };
    
    // Create a separate container for the toolbar
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar-root';
    document.body.appendChild(toolbarContainer);
    
    // Create separate React root for toolbar
    const toolbarRoot = createRoot(toolbarContainer);
    toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
  }).catch(() => {
    // Silently fail if stagewise is not available
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
