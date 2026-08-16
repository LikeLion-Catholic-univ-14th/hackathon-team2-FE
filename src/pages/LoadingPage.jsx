import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/LoadingPage.module.css";
import axios from "axios";
import useSurveyStore from "../store/surveyStore";

// 생성 요청 함수
export async function createGenerationRequest({
  archiveProductId,
  lockedDnaIds,
  futureContextId,
}) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/generations`,
    {
      archiveProductId,
      lockedDnaIds,
      futureContextId,
    },
  );

  return data;
}

// 생성 상태/결과 조회 함수
export async function fetchGenerationStatus(generationId) {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/generations/${generationId}`,
  );

  return data;
}

const loadingSteps = [
  "Archive Product Loaded",
  "DNA Analysis Completed",
  "Future Environment Generated",
  "AI Product Generated",
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const [progresses, setProgresses] = useState([0, 0, 0, 0]);
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const { product, dna, environment, resetSurvey } = useSurveyStore();

  useEffect(() => {
    let interval;

    async function fetchResult() {
      try {
        // 1. 생성 요청
        const response = await createGenerationRequest({
          archiveProductId: product,
          lockedDnaIds: dna,
          futureContextId: environment,
        });
        const generationId = response.data.generationId;

        // 2. 생성 상태 polling
        interval = setInterval(async () => {
          try {
            const response = await fetchGenerationStatus(generationId);
            const data = response.data;

            if (data.status === "COMPLETED") {
              clearInterval(interval);
              setCompleted([true, true, true, true]);
              setTimeout(() => navigate("/result", { state: data }), 200);
            }

            if (data.status === "FAILED") {
              clearInterval(interval);
              setIsErrorModalOpen(true);
              console.error("결과 조회 실패:", data.message);
            }
          } catch (error) {
            clearInterval(interval);
            setIsErrorModalOpen(true);
            console.error("결과 조회 실패:", error);
          }
        }, 4000);
      } catch (error) {
        setIsErrorModalOpen(true);
        console.error("결과 조회 실패:", error);
      }
    }

    fetchResult();

    return () => clearInterval(interval);
  }, []);

  // 각 로딩바 퍼센티지 채우기
  useEffect(() => {
    if (isErrorModalOpen) return;

    const interval = setInterval(() => {
      setProgresses((prev) => {
        const next = [...prev];

        if (next[currentStep] < 99) {
          next[currentStep] += 1;
        }

        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [currentStep, isErrorModalOpen]);

  // 다음 로딩바로 넘어가기
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
      <div
        className={`${styles.loadingSpinner} ${
          isErrorModalOpen ? styles.paused : ""
        }`}
      ></div>
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

      {isErrorModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.errorModal}>
            <div className={styles.modalTitle}>AI 제품 생성에 실패했어요.</div>
            <div className={styles.modalDescription}>
              일시적인 오류가 발생했습니다.
              <br />
              처음부터 다시 시도해주세요.
            </div>
            <button
              className={styles.modalButton}
              onClick={() => {
                resetSurvey();
                navigate("/");
              }}
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
