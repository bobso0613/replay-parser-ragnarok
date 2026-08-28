import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BASE_PATH } from './constants/index.ts';

const img = new Image();
img.src = `${BASE_PATH}base-background.png`;

img.onload = () => {
  document.getElementById('root')?.classList.add('hd');
};

createRoot(document.getElementById('root')!).render(<App />);
