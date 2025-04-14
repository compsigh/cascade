"use client";

import { useEffect, useState } from "react";
import Countdown from "react-countdown";

export function CountdownWrapper(
  { date, autoStart, revealedOnCompletion }: {
    date: number;
    autoStart: boolean;
    revealedOnCompletion?: React.ReactElement<any>;
  },
) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <span>00:00:30:00</span>;
  }

  return (
    <>
      <Countdown
        date={date}
        autoStart={autoStart}
      >
        {revealedOnCompletion}
      </Countdown>
    </>
  );
}
