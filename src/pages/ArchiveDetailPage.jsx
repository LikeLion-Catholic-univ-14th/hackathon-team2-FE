import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/pages/ArchiveDetailPage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";
import axios from "axios";
import { MOCK_ARCHIVES } from "../data/mockResult";

const lockedDnaMap = {
  Visetos: "VISETOS_LOCKED",
  Mobility: "MOBILITY_LOCKED",
  "Cognac Color": "COGNAC_LOCKED",
  "Geometric Structure": "GEOMETRIC_LOCKED",
  "Visible Identity": "IDENTITY_LOCKED",
  "Metal Studs": "STUDS_LOCKED",
  "Cultural Collaboration": "CULTURAL_LOCKED",
  "Miami Blue": "BLUE_LOCKED",
  "Adaptive Styling": "ADAPTIVE_LOCKED",
};

const futureContextMap = {
  "Space Travel": "SPACE_READY",
  "Hyper City": "CITY_READY",
  "Virtual Dimension": "VIRTUAL_READY",
};

export default function ArchiveDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [archive, setArchive] = useState(null);

  useEffect(() => {
    const fetchArchive = async () => {
      const useMockArchive = () => {
        const mockArchive = MOCK_ARCHIVES.find(
          (item) => String(item.id) === String(id),
        );

        setArchive(mockArchive || MOCK_ARCHIVES[0]);
        console.log("[목데이터] 아카이브 상세 데이터 사용");
      };

      if (!import.meta.env.VITE_API_URL) {
        useMockArchive();
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/future-archives/${id}`,
        );

        setArchive(response.data.data);
        console.log("[API 성공] 아카이브 상세 조회 완료");
      } catch (error) {
        console.error("아카이브 상세 조회 실패:", error);
        useMockArchive();
      }
    };

    fetchArchive();
  }, [id]);

  if (!archive) {
    return null;
  }

  const {
    productName,
    category,
    imageUrl,
    description,
    lockedDna,
    futureContext,
  } = archive;

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>YOUR FUTURE OBJECT</div>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={productName}></img>
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
      <div className={styles.buttonContainer}>
        <Button
          text="Archive로 돌아가기"
          onClick={() => navigate("/archive")}
        />
      </div>
    </div>
  );
}
