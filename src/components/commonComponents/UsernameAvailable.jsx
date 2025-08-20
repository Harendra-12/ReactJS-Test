import React from "react";

const UsernameAvailable = ({ username }) => {
  return (
    <>
      {username && username?.status === true ? (
        <span className="text-green-600 text-xs">{username?.message}</span>
      ) : (
        <span className="text-red-600 text-xs">{username?.message}</span>
      )}
    </>
  );
};

export default UsernameAvailable;
