import { useEffect } from "react";

const RetellWebCall = ({ token }) => {
  useEffect(() => {
    // Dynamically load the SDK script
    const script = document.createElement("script");
    script.src = "http://cdn.retellai.com/retell-sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.RetellWebCall && token) {
        window.RetellWebCall.init({
          token,
          containerId: "retell-widget",
        });
      }
    };
    document.body.appendChild(script);

    // Optional: Clean up the script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  return <div id="retell-widget" style={{ height: "500px", width: "100%" }} />;
};

export default RetellWebCall;
