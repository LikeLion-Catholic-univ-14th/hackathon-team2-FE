import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/pages/ArchivePage.module.css";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";
import { MOCK_ARCHIVES, MOCK_ARCHIVE_INSIGHT } from "../data/mockResult";

const lockedDnaMap = {
  VISETOS: "VISETOS",
  MOBILITY: "MOBILITY",
  "COGNAC COLOR": "COGNAC",
  "GEOMETRIC STRUCTURE": "GEOMETRIC",
  "VISIBLE IDENTITY": "IDENTITY",
  "METAL STUDS": "METAL",
  "CULTURAL COLLABORATION": "CULTURAL",
  "MIAMI BLUE": "BLUE",
  "ADAPTIVE STYLING": "ADAPTIVE",
};

const filters = ["ALL", "SPACE", "CITY", "VIRTUAL"];
const filterMap = {
  SPACE: "Space Travel",
  CITY: "Hyper City",
  VIRTUAL: "Virtual Dimension",
};

export default function ArchivePage() {
  const navigate = useNavigate();
  const [archives, setArchives] = useState([]);
  const [archiveInsight, setArchiveInsight] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const filteredArchives =
    selectedFilter === "ALL"
      ? archives
      : archives.filter(
          (item) => item.futureContext === filterMap[selectedFilter],
        );

  useEffect(() => {
    const fetchArchives = async () => {
      const useMockArchives = () => {
        setArchives(MOCK_ARCHIVES);
        setArchiveInsight(MOCK_ARCHIVE_INSIGHT);
        setIsLoading(false);
        console.log("[목데이터] 아카이브 목록 사용");
      };

      if (!import.meta.env.VITE_API_URL) {
        useMockArchives();
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/future-archives`,
        );
        const { archives = [], archiveInsight = null } = response.data;

        setArchives(archives);
        setArchiveInsight(archiveInsight);
        setIsLoading(false);
        console.log("[API 성공] 아카이브 목록 조회 완료");
      } catch (error) {
        console.error("아카이브 목록 조회 실패:", error);
        useMockArchives();
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
        {!isLoading && filteredArchives.length === 0 ? (
          <div className={styles.emptyMessage}>
            아직 저장된 아카이브가 없습니다.
          </div>
        ) : (
          filteredArchives.map((item) => {
            const resolvedImageUrl = item.imageUrl?.startsWith("http")
              ? item.imageUrl
              : `${import.meta.env.VITE_API_URL}${item.imageUrl}`;

            return (
              <div
                className={styles.listItem}
                key={item.id}
                onClick={() => navigate(`/archive/${item.id}`)}
              >
                <div className={styles.imageWrapper}>
                  <img src={resolvedImageUrl} alt={item.productName} />
                </div>
                <div className={styles.contentContainer}>
                  <span className={styles.productName}>{item.productName}</span>
                  <div className={styles.chipContainer}>
                    {item.lockedDna.map((dna, index) => (
                      <TagChip
                        key={dna}
                        text={lockedDnaMap[dna]}
                        variant={index === 1 ? "secondary" : undefined}
                      />
                    ))}
                    <TagChip
                      text={Object.keys(filterMap).find(
                        (key) => filterMap[key] === item.futureContext,
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {!isLoading && (archives.length === 0 || archiveInsight) && (
        <div className={styles.summaryContainer}>
          <span className={styles.summaryTitle}>Archive Insight</span>
          {archives.length > 0 && archiveInsight ? (
            <span className={styles.summaryContent}>
              가장 많이 선택된 DNA는 {archiveInsight.mostSelectedDna}, 가장 인기
              있는 미래 환경은{" "}
              {archiveInsight.mostPopularFutureInsight ??
                archiveInsight.mostPopularFutureContext}
              입니다.
            </span>
          ) : (
            <span className={styles.summaryContent}>
              저장된 아카이브를 분석하여 Insight를 제공합니다.
            </span>
          )}
        </div>
      )}
      <div className={styles.buttonWrapper}>
        <Button text="새 제품 만들기" onClick={() => navigate("/survey")} />
      </div>
    </div>
  );
}
