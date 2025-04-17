"use client";

import styles from "./DownloadInput.module.css";
type DownloadInputProps = {
  riddleNumber: number;
  input: string;
};

export function DownloadInput({ riddleNumber, input }: DownloadInputProps) {
  function handleDownload() {
    const blob = new Blob([input], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${riddleNumber}-input.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={handleDownload} className={styles.button}>
      Download Input
    </button>
  );
}
