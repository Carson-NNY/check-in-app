"use client";

import styles from "./Button.module.css";
import React, { ReactNode } from "react";

// Define the button patterns
type ButtonPattern = "blue" | "grey" | "blueOutline" | "green" | "red" | "teal";

interface ButtonProps {
  pattern: ButtonPattern;
  onClick: () => void;
  children: ReactNode;
  disabledStatus?: boolean;
}

export default function Button({
  pattern,
  onClick,
  children,
  disabledStatus,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={styles[pattern]}
      disabled={disabledStatus}
    >
      {children}
    </button>
  );
}
