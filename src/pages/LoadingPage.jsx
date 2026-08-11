import { useState, useEffect } from "react";
import styles from "../styles/pages/LoadingPage.module.css";

const loadingSteps = [
  "Archive Product Loaded",
  "DNA Analysis Completed",
  "Future Environment Generated",
  "AI Product Generated",
];

export default function LoadingPage() {
  const [progresses, setProgresses] = useState([0, 0, 0, 0]);
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgresses((prev) => {
        const next = [...prev];

        if (next[currentStep] < 99) {
          next[currentStep] += 1;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    if (progresses[currentStep] === 99) {
      if (currentStep < 3) {
        setCompleted((prev) => {
          const next = [...prev];
          next[currentStep] = true;
          return next;
        });

        setCurrentStep((prev) => prev + 1);
      }
    }
  }, [progresses]);

  return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
      <div className={styles.pageTitle}>AI TRANSLATING HERITAGE</div>
      <div className={styles.textContainer}>
        <div className={styles.mainText}>
          1976년의 MCM을
          <br />
          2076년으로 번역 중
        </div>
        <div className={styles.subText}>
          선택한 DNA와 미래 환경을 결합해
          <br />
          새로운 MCM 제품을 생성하고 있어요.
        </div>
      </div>
      <div className={styles.loadingBarContainer}>
        {loadingSteps.map((title, index) => (
          <div
            key={title}
            className={styles.loadingBar}
            style={{
              "--progress": completed[index] ? "100%" : `${progresses[index]}%`,
            }}
          >
            <span
              className={styles.loadingBarTitle}
              style={{
                opacity: completed[index]
                  ? 1
                  : 0.3 + (progresses[index] / 100) * 0.7,
              }}
            >
              {title}
            </span>

            <span
              className={styles.loadingBarStatus}
              style={{
                opacity: completed[index] || currentStep === index ? 1 : 0.3,
              }}
            >
              {completed[index] ? "DONE" : `${progresses[index]}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
