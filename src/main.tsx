
/**
 * Application Entry Point
 * 
 * This is the main entry file that bootstraps the React application.
 * It:
 * - Creates the React root element
 * - Renders the main App component
 * - Imports global CSS styles
 * - Uses React 18's createRoot for concurrent features
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create React root and render the main App component
// Uses non-null assertion as the root element is guaranteed to exist in index.html
createRoot(document.getElementById("root")!).render(<App />);
