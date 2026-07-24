"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./icons/ReaderIcons";

export default function NightModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("manga-neko-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "สลับเป็นโหมดสว่าง" : "สลับเป็น Night Mode"}
      title={dark ? "โหมดสว่าง" : "Night Mode"}
      className="outline-btn !rounded-full !px-3"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
