"use client";

import { useEffect, useState } from "react";
import styles from "./site.module.css";

export default function Clock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className={styles.clock}>{time}</span>;
}
