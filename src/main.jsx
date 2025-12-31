// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { getNumber, setItem, removeItem } from './services/storage';

const DEFAULT_SCALE = 50;
document.body.style.zoom = DEFAULT_SCALE / 100;

const hydrateScale = async () => {
  const initialScale = await getNumber('uiScaleV2', null);
  if (Number.isFinite(initialScale)) {
    document.body.style.zoom = initialScale / 100;
    return;
  }
  const legacy = await getNumber('uiScale', null);
  const migrated = Number.isFinite(legacy)
    ? Math.max(0, Math.min(100, Math.round(legacy / 2)))
    : DEFAULT_SCALE;
  document.body.style.zoom = migrated / 100;
  await setItem('uiScaleV2', String(migrated));
  await removeItem('uiScale');
};

hydrateScale().catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
