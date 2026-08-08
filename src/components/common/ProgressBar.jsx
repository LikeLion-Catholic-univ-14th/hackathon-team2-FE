import styles from "../../styles/components/ProgressBar.module.css";

export default function ProgressBar({ currentStep = 1 }) {
  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBar}>
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`${styles.progressItem} ${
              step <= currentStep ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
