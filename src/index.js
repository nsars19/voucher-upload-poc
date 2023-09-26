import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CognitoProvider from "./context/cognito";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CognitoProvider>
      <App />
    </CognitoProvider>
  </React.StrictMode>
);
