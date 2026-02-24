import { useEffect } from "react";
import Portfolio from "./Components/Portfolio";

export default function App() {
  useEffect(() => {
    let messageShown = localStorage.getItem("contextMenuMessageShown") === "true";

    const handleContextMenu = (e) => {
      if (!messageShown) {
        e.preventDefault();
        alert("Hey Why you're sniffing into my Website 👀");
        messageShown = true;
        localStorage.setItem("contextMenuMessageShown", "true");
      }
      // If already shown, allow default context menu
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return <Portfolio />;
}
