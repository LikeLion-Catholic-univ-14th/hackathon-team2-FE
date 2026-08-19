import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSurveyStore from "../store/surveyStore";
import styles from "../styles/pages/SurveyPage.module.css";
import ProgressBar from "../components/common/ProgressBar";
import Button from "../components/common/Button";
import TagChip from "../components/ui/TagChip";
import cityIcon from "../assets/city_icon.svg";
import p2Image1 from "../assets/p2_image1_2.png";
import p2Image2 from "../assets/p2_image2_2.png";
import p2Image3 from "../assets/p2_image3_2.png";
import spaceIcon from "../assets/space_icon.svg";
import virtualIcon from "../assets/virtual_icon.svg";

// Mock Data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Ottomar 비세토스 위켄더",
    shortDescription:
      "MCM의 여행용 캐리어 헤리티지와 시그니처 비세토스를 담은 대표 위켄더백",
    tags: ["VISETOS", "COGNAC_Color", "MOBILITY", "GeoMetric_Structure"],
  },
  {
    id: 2,
    name: "Stark 사이드 비세토스 백팩",
    shortDescription:
      "블랙 비세토스와 피라미드 스터드로 도시적 이동성과 대담한 자기표현을 담은 MCM의 대표 백팩",
    tags: ["Visetos", "Mobility", "Visible_Identity", "Metal Studs"],
  },
  {
    id: 3,
    name: "SMCM X We The Best 비세토스 크로스바디 파우치",
    shortDescription:
      "코냑 비세토스에 선명한 마이애미 블루와 음악 문화를 결합해 MCM 헤리티지를 자유롭게 재해석한 협업 파우치",
    tags: [
      "Visetos",
      "Miami_Blue",
      "Adaptive_Styling",
      "Cultural_Collaboration",
    ],
  },
];

const PRODUCT_DNA_DATA = {
  1: {
    dna: [
      {
        id: 1,
        name: "VISETOS",
        ratio: 37,
        description: "MCM을 즉시 인식하게 하는 시그니처 모노그램",
      },
      {
        id: 2,
        name: "MOBILITY",
        ratio: 29,
        description: "여행과 이동이라는 MCM의 본질적인 가치",
      },
      {
        id: 3,
        name: "COGNAC COLOR",
        ratio: 22,
        description: "브랜드 헤리티지를 보여주는 따뜻한 코냑 색감",
      },
      {
        id: 4,
        name: "GEOMETRIC STRUCTURE",
        ratio: 12,
        description: "트렁크에서 이어지는 입체적이고 기하학적인 형태",
      },
    ],
  },
  2: {
    dna: [
      {
        id: 1,
        name: "VISETOS",
        ratio: 34,
        description: "MCM을 즉시 인식하게 하는 시그니처 모노그램",
      },
      {
        id: 2,
        name: "VISIBLE IDENTITY",
        ratio: 28,
        description: "도시적 이동성과 대담한 브랜드 상징성",
      },
      {
        id: 3,
        name: "METAL STUDS",
        ratio: 23,
        description: "피라미드 스터드로 표현하는 대담한 디테일",
      },
      {
        id: 4,
        name: "MOBILITY",
        ratio: 15,
        description: "여행과 이동이라는 MCM의 본질적인 가치",
      },
    ],
  },
  3: {
    dna: [
      {
        id: 1,
        name: "VISETOS",
        ratio: 35,
        description: "MCM을 즉시 인식하게 하는 시그니처 모노그램",
      },
      {
        id: 2,
        name: "CULTURAL COLLABORATION",
        ratio: 30,
        description: "음악 및 스트리트 문화와의 자유로운 융합",
      },
      {
        id: 3,
        name: "MIAMI BLUE",
        ratio: 20,
        description: "선명하고 에너제틱한 시그니처 컬러",
      },
      {
        id: 4,
        name: "ADAPTIVE STYLING",
        ratio: 15,
        description: "상황에 따라 다채롭게 변형되는 크로스바디 파우치 형태",
      },
    ],
  },
};

const productImages = {
  1: p2Image1,
  2: p2Image2,
  3: p2Image3,
};

const environmentIcons = {
  1: spaceIcon,
  2: cityIcon,
  4: virtualIcon,
};

export default function SurveyPage() {
  const navigate = useNavigate();

  // Zustand 스토어 구독 (상태 및 액션)
  const product = useSurveyStore((state) => state.product);
  const dna = useSurveyStore((state) => state.dna);
  const environment = useSurveyStore((state) => state.environment);

  const setProduct = useSurveyStore((state) => state.setProduct);
  const toggleDna = useSurveyStore((state) => state.toggleDna);
  const setEnvironment = useSurveyStore((state) => state.setEnvironment);

  const [currentScreen, setCurrentScreen] = useState(2);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 데이터 State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [dnaAnalysis, setDnaAnalysis] = useState([]);
  const [heritageLocks, setHeritageLocks] = useState([]);
  const [futureContexts, setFutureContexts] = useState([]);

  // 애니메이션
  const [dnaProgressValues, setDnaProgressValues] = useState([]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // API 호출 메서드들
  const fetchProducts = async () => {
    if (!import.meta.env.VITE_API_URL) {
      console.log("[목데이터] Products 데이터 사용");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/archive-products`,
      );
      const result = await res.json();
      if (result.success && result.data?.products) {
        setProducts(result.data.products);
        console.log("[API 성공] Products 데이터 조회 완료");
      }
    } catch (err) {
      console.warn("Products API 호출 실패:", err);
      console.log("[목데이터] Products 초기 데이터 사용");
    }
  };

  const fetchDnaAnalysis = async (productId) => {
    const selectedData =
      PRODUCT_DNA_DATA[productId]?.dna || PRODUCT_DNA_DATA[1].dna;

    const fallbackDna = selectedData.map((item) => ({
      id: item.id,
      name: item.name,
      ratio: item.ratio,
    }));

    const applyProgressAnimation = (analysisData) => {
      setDnaProgressValues(analysisData.map(() => 0));

      setTimeout(() => {
        setDnaProgressValues(analysisData.map((item) => item.ratio));
      }, 200);
    };

    if (!import.meta.env.VITE_API_URL) {
      console.log("[목데이터] DNA Analysis 데이터 사용");
      setDnaAnalysis(fallbackDna);
      applyProgressAnimation(fallbackDna);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/archive-products/${productId}/dna-analysis`,
      );

      const data = await res.json();

      const analysisData = data.dnaAnalysis || fallbackDna;

      setDnaAnalysis(analysisData);
      applyProgressAnimation(analysisData);
      console.log("[API 성공] DNA Analysis 데이터 조회 완료");
    } catch (err) {
      console.warn("DNA Analysis API 호출 실패:", err);
      console.log("[목데이터] DNA Analysis fallback 데이터 사용");
      setDnaAnalysis(fallbackDna);
      applyProgressAnimation(fallbackDna);
    }
  };

  const fetchHeritageLocks = async (productId) => {
    const selectedData =
      PRODUCT_DNA_DATA[productId]?.dna || PRODUCT_DNA_DATA[1].dna;

    const fallbackLocks = selectedData.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }));

    if (!import.meta.env.VITE_API_URL) {
      console.log("[목데이터] Heritage Locks 데이터 사용");
      setHeritageLocks(fallbackLocks);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/archive-products/${productId}/heritage-lock-options`,
      );

      const data = await res.json();

      setHeritageLocks(data.heritageLockOptions || fallbackLocks);
      console.log("[API 성공] Heritage Locks 데이터 조회 완료");
    } catch (err) {
      console.warn("Heritage Locks API 호출 실패:", err);
      console.log("[목데이터] Heritage Locks fallback 데이터 사용");
      setHeritageLocks(fallbackLocks);
    }
  };

  const fetchFutureContexts = async () => {
    const fallbackContexts = [
      {
        id: 1,
        name: "Space Travel",
        description: "무중력 이동과 행성 간 여행을 위한 미래 환경",
      },
      {
        id: 2,
        name: "Hyper City",
        description: "초고밀도 도시의 빠른 이동과 스마트한 보안 환경",
      },
      {
        id: 4,
        name: "Virtual Dimension",
        description: "현실과 디지털 정체성이 연결된 융합 공간",
      },
    ];

    if (!import.meta.env.VITE_API_URL) {
      console.log("[목데이터] Future Contexts 데이터 사용");
      setFutureContexts(fallbackContexts);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/future-contexts`,
      );

      const data = await res.json();

      setFutureContexts(data.futureContexts || fallbackContexts);
      console.log("[API 성공] Future Contexts 데이터 조회 완료");
    } catch (err) {
      console.warn("Future Contexts API 호출 실패:", err);
      console.log("[목데이터] Future Contexts fallback 데이터 사용");
      setFutureContexts(fallbackContexts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const goToScreen = (screenNum) => {
    setCurrentScreen(screenNum);

    if (screenNum === 3 && product) fetchDnaAnalysis(product);
    else if (screenNum === 4 && product) fetchHeritageLocks(product);
    else if (screenNum === 5) fetchFutureContexts();
  };

  const handleProductSelect = (productId) => {
    setProduct(productId);
  };

  const handleDnaToggle = (dnaId) => {
    if (!dna.includes(dnaId) && dna.length >= 2) {
      triggerToast("최대 2개까지 선택할 수 있습니다.");
      return;
    }
    toggleDna(dnaId);
  };

  const currentProduct = products.find((p) => p.id === product);

  const getEnvIcon = (env) => {
    if (environmentIcons[env.id]) return environmentIcons[env.id];

    const nameLower = (env.name || "").toLowerCase();
    if (nameLower.includes("space")) return spaceIcon;
    if (nameLower.includes("city")) return cityIcon;
    if (nameLower.includes("virtual")) return virtualIcon;
    return "";
  };

  return (
    <div>
      {/* 토스트 메시지 */}
      <div className={`${styles["toast-msg"]} ${showToast ? styles.show : ""}`}>
        {toastMessage}
      </div>

      {/* SCREEN 2: Archive Select */}
      <div
        className={`${styles.screen} ${currentScreen === 2 ? styles.active : ""}`}
      >
        <ProgressBar />
        <div className={styles["sub-caption"]}>ARCHIVE 1976–2026</div>
        <span className={styles["page-title"]}>어떤 MCM에서 시작할까요?</span>
        <span className={styles["page-desc"]}>
          미래로 번역할 아카이브 제품을 선택해주세요.
        </span>

        <div className={styles["product-list"]}>
          {products.map((prod) => (
            <div
              key={prod.id}
              className={`${styles["product-card"]} ${product === prod.id ? styles.selected : ""}`}
              onClick={() => handleProductSelect(prod.id)}
            >
              <div className={styles["card-img-wrap"]}>
                <img
                  src={prod.img || productImages[prod.id]}
                  alt={prod.name}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/90?text=MCM")
                  }
                />
              </div>
              <div className={styles["card-info"]}>
                <div className={styles["card-title"]}>{prod.name}</div>
                <div className={styles["card-desc"]}>
                  {prod.shortDescription}
                </div>
                <div className={styles["tag-group"]}>
                  {prod.tags?.slice(0, 2).map((tag, i) => (
                    <TagChip key={i} text={tag} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btnWrapper}>
          <Button
            text="이 제품으로 시작하기"
            disabled={!product}
            onClick={() => goToScreen(3)}
          />
        </div>
      </div>

      {/* SCREEN 3: DNA Decode */}
      <div
        className={`${styles.screen} ${currentScreen === 3 ? styles.active : ""}`}
      >
        <ProgressBar currentStep={2} />
        <div className={styles["sub-caption"]}>HERITAGE ANALYSIS</div>
        <span className={styles["page-title"]}>
          이 제품의 DNA를 분해해볼게요
        </span>
        <span className={styles["page-desc"]}>
          MCM을 MCM답게 만드는 시각적·기능적 요소를 보여줍니다.
        </span>

        {currentProduct && (
          <>
            <div className={styles["product-display-card"]}>
              <div className={styles["display-img-box"]}>
                <img
                  src={currentProduct.img || productImages[currentProduct.id]}
                  alt={currentProduct.name}
                />
              </div>
            </div>
            <div className={styles["display-title"]}>{currentProduct.name}</div>

            <div className={styles["dna-stats-container"]}>
              {dnaAnalysis.map((item, idx) => (
                <div className={styles["dna-stat-item"]} key={idx}>
                  <div className={styles["dna-label-row"]}>
                    <span style={{ color: "var(--text-main)" }}>
                      {item.name}
                    </span>
                    <span style={{ color: "var(--primary-blue)" }}>
                      {dnaProgressValues[idx] || 0}%
                    </span>
                  </div>
                  <div className={styles["dna-bar-bg"]}>
                    <div
                      className={styles["dna-bar-fill"]}
                      style={{ width: `${dnaProgressValues[idx] || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className={styles.btnWrapper}>
          <Button text="Heritage Lock 설정하기" onClick={() => goToScreen(4)} />
        </div>
      </div>

      {/* SCREEN 4: Heritage Lock */}
      <div
        className={`${styles.screen} ${currentScreen === 4 ? styles.active : ""}`}
      >
        <ProgressBar currentStep={3} />
        <div className={styles["sub-caption"]}>KEEP THE IDENTITY</div>
        <span className={styles["page-title"]}>
          100년 뒤에도 남길
          <br />
          MCM DNA를 골라주세요
        </span>
        <span className={styles["page-desc"]}>
          최소 1개가 미래 제품에 반드시 유지됩니다.
        </span>

        <div className={styles["dna-grid"]}>
          {heritageLocks.map((item) => {
            const isSelected = dna.includes(item.id);
            return (
              <div
                key={item.id}
                className={`${styles["dna-lock-card"]} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleDnaToggle(item.id)}
              >
                {isSelected && (
                  <span className={styles["locked-badge"]}>LOCKED</span>
                )}
                <div className={styles["dna-card-title"]}>{item.name}</div>
                <div className={styles["dna-card-desc"]}>
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles["locked-summary-box"]}>
          <div className={styles["summary-title"]}>Locked DNA</div>
          <div className={styles["summary-content"]}>
            {dna.length === 0
              ? "선택된 DNA가 없습니다."
              : dna.map((id) => {
                  const name = heritageLocks.find((d) => d.id === id)?.name;

                  if (!name) return null;

                  return (
                    <span className={styles["dna-chip"]} key={id}>
                      {name.toUpperCase()}
                    </span>
                  );
                })}
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            text="미래 환경 선택하기"
            disabled={dna.length === 0}
            onClick={() => goToScreen(5)}
          />
        </div>
      </div>

      {/* SCREEN 5: Environment Select */}
      <div
        className={`${styles.screen} ${currentScreen === 5 ? styles.active : ""}`}
      >
        <ProgressBar currentStep={4} />
        <div>
          <div className={styles["sub-caption"]}>WELCOME TO 2076</div>
          <span className={styles["page-title"]}>
            2076년, 이 제품은
            <br />
            어디에서 사용될까요?
          </span>
          <br />
          <span className={styles["page-desc"]}>
            미래 환경에 따라 기능과 소재가 자동으로 설계됩니다.
          </span>
        </div>

        <div className={styles["env-list"]}>
          {futureContexts.map((env) => (
            <div
              key={env.id}
              className={`${styles["env-card"]} ${environment === env.id ? styles.selected : ""}`}
              onClick={() => setEnvironment(env.id)}
            >
              <div className={styles["env-icon-wrap"]}>
                {getEnvIcon(env) ? (
                  <img src={getEnvIcon(env)} alt={`${env.name} 아이콘`} />
                ) : (
                  "✨"
                )}
              </div>
              <div className={styles["env-info"]}>
                <div className={styles["env-title"]}>{env.name}</div>
                <div className={styles["env-desc"]}>{env.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.btnWrapper}>
          <Button
            text="2076년 제품 생성하기"
            onClick={() => {
              if (!environment) return;
              navigate("/loading");
            }}
          />
        </div>
      </div>
    </div>
  );
}
