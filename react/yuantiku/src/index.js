import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// 清除默认边距与样式
import 'reset-css'

import 'lib-flexible'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
