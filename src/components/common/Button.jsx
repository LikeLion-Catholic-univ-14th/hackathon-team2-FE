import { useState } from "react";
import styles from "../../styles/components/Button.module.css";

export default function Button({ text, variant = "primary", onClick }) {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleClick = (e) => {
    setIsGlitching(true);

    setTimeout(() => {
      setIsGlitching(false);

      if (onClick) {
        onClick(e);
      }
    }, 800);
  };

  return (
    <div
      className={`${styles.buttonWrapper} ${isGlitching ? styles.glitch : ""}`}
    >
      <span className={styles.glitch1} />
      <span className={styles.glitch2} />

      <button
        type="button"
        onClick={handleClick}
        className={`${styles.button} ${styles[variant]}`}
      >
        {text}
      </button>
    </div>
  );
}
