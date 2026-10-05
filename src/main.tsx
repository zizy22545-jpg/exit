import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ExportPatrolApp } from '../components/ExportPatrolApp';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(<StrictMode><ExportPatrolApp/></StrictMode>);
