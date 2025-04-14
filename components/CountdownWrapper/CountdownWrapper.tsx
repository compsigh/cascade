"use client";

import Countdown from "react-countdown";
import { useState, useEffect } from "react";

export function CountdownWrapper({
  date,
  autoStart,
  revealedOnCompletion,
}: {
  date: number;
  autoStart: boolean;
  revealedOnCompletion?: React.ReactElement<unknown>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <span>00:00:30:00</span>;

  return (
    <>
      <Countdown date={date} autoStart={autoStart}>
        {revealedOnCompletion}
      </Countdown>
    </>
  );
}
