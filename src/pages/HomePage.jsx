import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/HomePage.module.css";
import Button from "../components/common/Button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={`${styles.screen} ${styles.active}`}>
        <div className={styles["onboarding-main"]}>
          <div className={styles.textContainer}>
            <span className={styles.year}>2076</span>
            <span className={styles.brandName}>MCM</span>
            <div className={styles.serviceName}>
              <span>TIME</span>
              <span>PORTAL</span>
            </div>
            <span className={styles.subTextEng}>
              From heritage to the next century
            </span>
            <div className={styles.subTextKo}>
              <span>MCM의 과거를 선택하고</span>
              <span>다음 세기의 제품을 직접 설계하세요.</span>
            </div>
          </div>

          <Button
            text="TIME PORTAL ENTER"
            className={styles.btn}
            style={{ padding: "20px" }}
            onClick={() => navigate("/survey")}
          />
        </div>
      </div>
    </div>
  );
}
