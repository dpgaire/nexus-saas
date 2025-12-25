import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { NetworkStatusProvider } from "./context/NetworkStatusContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <NetworkStatusProvider>
          <App />
        </NetworkStatusProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
