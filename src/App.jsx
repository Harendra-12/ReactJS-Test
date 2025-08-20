import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AppRoutes } from "./routes";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import usePreventRadixAutoToggle from "./usePreventRadixAutoToggle";

function App() {
  usePreventRadixAutoToggle();
  useEffect(() => {
    const preventGlobalScroll = (e) => {
      const el = document.activeElement;

      // if focused on something interactive, do not block
      const isInteractive =
        el?.tagName === "INPUT" ||
        el?.tagName === "TEXTAREA" ||
        el?.tagName === "BUTTON" ||
        el?.tagName === "SELECT" ||
        el?.isContentEditable;

      const isInsideRadix = el?.closest("[data-radix-popper-content-wrapper]");

      if (
        !isInteractive &&
        !isInsideRadix &&
        (e.key === " " || e.key === "Enter")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventGlobalScroll);

    return () => window.removeEventListener("keydown", preventGlobalScroll);
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
      <Toaster theme="dark" />
    </Provider>
  );
}

export default App;
