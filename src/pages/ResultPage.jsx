import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/ResultPage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";

export default function ResultPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
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
      <div className={styles.buttonContainer}>
        <Button
          text="Future Archive에 저장"
          onClick={() => navigate("/archive")}
        />
        <Button
          text="다시 생성하기"
          variant="secondary"
          onClick={() => navigate("/survey")}
        />
      </div>
    </div>
  );
}
