import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { setTranslations, setDefaultLanguage } from 'react-multi-lang'
import eng from '../shared/locales/eng.json'
import fa from '../shared/locales/fa.json'

setTranslations({eng, fa})
setDefaultLanguage('eng')
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />
);