import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/ResultPage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";
import html2canvas from "html2canvas";

export default function ResultPage() {
  const navigate = useNavigate();
  const resultRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  const captureAsBlob = async () => {
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const blob = await captureAsBlob();
      const file = new File([blob], "future-object.png", { type: "image/png" });

      // 파일 공유를 지원하는 환경: 공유 시트 오픈
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
      } else {
        // 미지원 환경 폴백: 바로 다운로드
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "future-object.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      // 공유창에서 취소한 경우 포함
      if (error.name !== "AbortError") {
        console.error("공유/저장 실패:", error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className={styles.captureArea} ref={resultRef}>
        <div className={styles.pageTitle}>YOUR FUTURE OBJECT</div>
        <div className={styles.imageContainer}></div>
        <div className={styles.textContainer}>
          <span className={styles.productTitle}>MCM AERO STARK 2076</span>
          <span className={styles.productCategory}>
            Adaptive Space Mobility Bag
          </span>
          <span className={styles.productContent}>
            비세토스와 이동성 DNA를 유지하면서 무중력 환경에 맞는 경량 구조와
            변형형 수납 시스템을 적용한 미래형 MCM 오브젝트입니다.
          </span>
        </div>
        <div className={styles.tagContainer}>
          <div className={styles.numberSign}>#</div>
          <TagChip text="VISETOS_LOCKED" />
          <TagChip text="MOBILITY_LOCKED" variant="secondary" />
          <TagChip text="SPACE_READY" />
        </div>
        <div className={styles.summaryContainer}>
          <span className={styles.summaryTitle}>1976 - 2026 - 2076</span>
          <span className={styles.summaryContent}>
            헤리티지는 유지하고, 기능과 소재는 미래 환경에 맞게 변화했습니다.
          </span>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          text={isSharing ? "저장 중..." : "결과 저장 및 공유"}
          onClick={handleShare}
          disabled={isSharing}
        />
        <Button
          text="Future Archive에 공유"
          onClick={() => navigate("/archive")}
        />
        <Button
          text="다시 생성하기"
          variant="secondary"
          onClick={() => navigate("/survey")}
        />
      </div>
    </>
  );
}
