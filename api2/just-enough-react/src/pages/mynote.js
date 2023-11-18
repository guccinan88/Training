import React, { useEffect } from "react";
const MyNotes = () => {
  useEffect(() => {
    document.title = "My Notes - Notedly";
  });
  return (
    <>
      <h1>Notedly</h1>
      <p>These are my nores!</p>
    </>
  );
};
export default MyNotes;
