import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './lib/authContext.tsx';
import { ThemeProvider } from './lib/themeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
