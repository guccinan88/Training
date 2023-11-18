import React, { useEffect } from "react";
const Favorites = () => {
  useEffect(() => {
    document.title = "Favorites-Notedly";
  });
  return (
    <>
      <h1>Notedly</h1>
      <p>These are my favorites</p>
    </>
  );
};
export default Favorites;
