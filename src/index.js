import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MoralisProvider } from "react-moralis";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MoralisProvider serverUrl="https://7ncxqzofdfwo.usemoralis.com:2053/server" appId="8orQ3ge2Re6mroJKAE9FgtIw9aZJH65tMYDLHYjV">
    <App />
    </MoralisProvider>
  </React.StrictMode>
);

