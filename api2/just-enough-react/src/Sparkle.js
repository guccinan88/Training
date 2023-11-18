import React, { useState } from "react";

export default function Sparkle() {
  const [sparkle, addSparkle] = useState("");
  return (
    <>
      <button onClick={() => addSparkle(sparkle + "\u274C")}>
        Add some aparkle
      </button>
      <p>{sparkle}</p>
    </>
  );
}
