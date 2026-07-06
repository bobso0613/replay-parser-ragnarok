import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const img = new Image();
img.src = '/base-background.png';

img.onload = () => {
  document.getElementById('root')?.classList.add('hd');
};

createRoot(document.getElementById('root')!).render(<App />);
