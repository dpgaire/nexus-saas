import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import OfflineScreen from "./components/OfflineScreen";



// Main render logic
const root = createRoot(document.getElementById("root"));

if (!navigator.onLine) {
  // If offline on initial load → show offline screen
  root.render(<OfflineScreen />);
} else {
  // If online → render the full app
  root.render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}