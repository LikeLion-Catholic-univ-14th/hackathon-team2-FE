import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/pages/ResultPage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";
import html2canvas from "html2canvas";
import axios from "axios";
import { MOCK_RESULT_DATA } from "../data/mockResult";

const lockedDnaMap = {
  VISETOS: "VISETOS_LOCKED",
  MOBILITY: "MOBILITY_LOCKED",
  "COGNAC COLOR": "COGNAC_LOCKED",
  "GEOMETRIC STRUCTURE": "GEOMETRIC_LOCKED",
  "VISIBLE IDENTITY": "IDENTITY_LOCKED",
  "METAL STUDS": "METAL_LOCKED",
  "CULTURAL COLLABORATION": "CULTURAL_LOCKED",
  "MIAMI BLUE": "BLUE_LOCKED",
  "ADAPTIVE STYLING": "ADAPTIVE_LOCKED",
};

const futureContextMap = {
  "Space Travel": "SPACE_READY",
  "Hyper City": "CITY_READY",
  "Virtual Dimension": "VIRTUAL_READY",
};

export default function ResultPage() {
  const navigate = useNavigate();
  const resultRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { state } = useLocation();
  const resultData = state?.productName ? state : MOCK_RESULT_DATA;
  const {
    generationId,
    productName,
    category,
    imageUrl,
    description,
    lockedDna,
    futureContext,
  } = resultData;

  if (resultData.source === "mock") {
    console.log("[목데이터] 결과 데이터 사용");
  } else {
    console.log("[API 성공] 결과 데이터 사용");
  }

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

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    if (
      !import.meta.env.VITE_API_URL ||
      generationId === MOCK_RESULT_DATA.generationId
    ) {
      console.log("[목데이터] 아카이브 저장 성공 처리");
      setIsSaving(false);
      navigate("/archive");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/generations/${generationId}/save`,
      );
      console.log("[API 성공] 아카이브 저장 완료");
      navigate("/archive");
    } catch (error) {
      console.error("아카이브 저장 실패:", error);
      alert("아카이브 저장에 실패했습니다.");
      setIsSaving(false);
    }
  };

  const resolvedImageUrl = imageUrl?.startsWith("http")
    ? imageUrl
    : `${import.meta.env.VITE_API_URL}${imageUrl}`;

  return (
    <>
      <div className={styles.captureArea} ref={resultRef}>
        <div className={styles.pageTitle}>YOUR FUTURE OBJECT</div>
        <div className={styles.imageContainer}>
          <img src={resolvedImageUrl} alt={productName}></img>
        </div>
        <div className={styles.textContainer}>
          <span className={styles.productTitle}>{productName}</span>
          <span className={styles.productCategory}>{category}</span>
          <span className={styles.productContent}>{description}</span>
        </div>
        <div className={styles.tagContainer}>
          <div className={styles.numberSign}>#</div>
          {lockedDna.map((dna, index) => (
            <TagChip
              key={dna}
              text={lockedDnaMap[dna]}
              variant={index === 1 ? "secondary" : undefined}
            />
          ))}
          <TagChip text={futureContextMap[futureContext]} />
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
          text={isSharing ? "로딩 중..." : "이미지 저장 및 공유"}
          onClick={handleShare}
        />
        <Button
          text={isSaving ? "로딩 중..." : "Future Archive에 저장"}
          onClick={handleSave}
        />
        <Button
          text="다시 생성하기"
          variant="secondary"
          onClick={() => navigate("/loading")}
        />
      </div>
    </>
  );
}
