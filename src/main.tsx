import { createRoot } from "react-dom/client";
import App from "./App";
import { stylesReady } from "./styles-ready";

void stylesReady().then(()=>{
  createRoot(document.getElementById("root")!).render(<App />);
});
