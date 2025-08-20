import { useEffect } from "react";

function useStopRadixSpaceEnterToggle() {
    // Mat padho smj nhi aayaga
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (key !== " " && key !== "Enter") return;

      const target = e.target;

      const tag = target.tagName?.toLowerCase?.();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable ||
        target.closest("[contenteditable=true]");
      if (isTyping) {
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => {
      document.removeEventListener("keydown", handler, true);
    };
  }, []);
}

export default useStopRadixSpaceEnterToggle;
