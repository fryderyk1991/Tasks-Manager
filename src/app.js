import React from 'react';
import { createRoot } from 'react-dom/client';

import TasksManager from './components/TasksManager'

import './styles/main.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

const App = () => <TasksManager/>;

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
