import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/pages/ArchivePage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";

const filters = ["ALL", "SPACE", "CITY", "VIRTUAL"];
const filterMap = {
  SPACE: "Space Travel",
  CITY: "Hyper City",
  VIRTUAL: "Virtual Dimension",
};

export default function ArchivePage() {
  const navigate = useNavigate();
  const [archives, setArchives] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const filteredArchives =
    selectedFilter === "ALL"
      ? archives
      : archives.filter(
          (item) => item.futureContext === filterMap[selectedFilter],
        );

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await axios.get("/data/archives.json");
        setArchives(response.data.archives);
      } catch (error) {
        console.error("아카이브 목록 조회 실패:", error);
      }
    };

    fetchArchives();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>COLLECTIVE FUTURE</div>
      <div className={styles.textContainer}>
        <span className={styles.mainText}>Future Archive</span>
        <span className={styles.subText}>
          방문자들이 함께 설계한 다음 세기의 MCM을 확인해보세요.
        </span>
      </div>
      <div className={styles.filterContainer}>
        {filters.map((filter) => (
          <div
            key={filter}
            className={`${styles.filterChip} ${
              selectedFilter === filter ? styles.active : ""
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </div>
        ))}
      </div>
      <div className={styles.listContainer}>
        {filteredArchives.map((item) => (
          <div className={styles.listItem} key={item.id}>
            <div className={styles.imageWrapper}>
              <img src={item.imageUrl} alt={item.productName} />
            </div>
            <div className={styles.contentContainer}>
              <span className={styles.productName}>{item.productName}</span>
              <div className={styles.chipContainer}>
                {item.lockedDna.map((dna) => (
                  <TagChip key={dna} text={dna} />
                ))}
                <TagChip
                  text={Object.keys(filterMap).find(
                    (key) => filterMap[key] === item.futureContext,
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.summaryContainer}>
        <span className={styles.summaryTitle}>Archive Insight</span>
        <span className={styles.summaryContent}>
          가장 많이 선택된 DNA는 Visetos, 가장 인기 있는 미래 환경은 Space
          Travel입니다.
        </span>
      </div>
      <div className={styles.buttonWrapper}>
        <Button text="새 제품 만들기" onClick={() => navigate("/survey")} />
      </div>
    </div>
  );
}
