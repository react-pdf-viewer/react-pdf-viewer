import React from 'react';
import { hydrate } from 'react-dom';

import App from './App';

const rootElement = document.getElementById('root');
hydrate(<App />, rootElement);
