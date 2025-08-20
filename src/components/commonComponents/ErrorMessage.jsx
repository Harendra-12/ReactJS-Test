import React from "react";

const ErrorMessage = ({ text }) => {
  return (
    <>
      <p className="text-red-500 text-xs">{text}</p>
    </>
  );
};

export default ErrorMessage;
