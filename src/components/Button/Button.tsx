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
  blurBackground?: boolean;
}

// customizable button component, displayed based on the pattern prop
export default function Button({
  pattern,
  onClick,
  children,
  disabledStatus,
  blurBackground = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles[pattern]} ${
        blurBackground ? styles.blurEffect : ""
      }`}
      disabled={disabledStatus}
    >
      {children}
    </button>
  );
}
