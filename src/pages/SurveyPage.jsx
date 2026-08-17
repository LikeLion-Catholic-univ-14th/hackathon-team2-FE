import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSurveyStore from '../store/surveyStore';
import styles from '../styles/pages/SurveyPage.module.css';

// 백엔드 API 주소 (비어있으면 기본 Mock Data 사용)
const API_BASE_URL = ''; 

// Mock Data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Ottomar 비세토스 위켄더",
    shortDescription: "MCM의 여행용 캐리어 헤리티지와 시그니처 비세토스를 담은 대표 위켄더백",
    tags: ["VISETOS", "COGNAC_Color", "MOBILITY", "GeoMetric_Structure"]
  },
  {
    id: 2,
    name: "Stark 사이드 비세토스 백팩",
    shortDescription: "블랙 비세토스와 피라미드 스터드로 도시적 이동성과 대담한 자기표현을 담은 MCM의 대표 백팩",
    tags: ["Visetos", "Mobility", "Visible_Identity", "Metal Studs"]
  },
  {
    id: 3,
    name: "SMCM X We The Best 비세토스 크로스바디 파우치",
    shortDescription: "코냑 비세토스에 선명한 마이애미 블루와 음악 문화를 결합해 MCM 헤리티지를 자유롭게 재해석한 협업 파우치",
    tags: ["Visetos", "Miami_Blue", "Adaptive_Styling", "Cultural_Collaboration"]
  }
];

const PRODUCT_DNA_DATA = {
  1: {
    dna: [
      { id: 1, name: "VISETOS", ratio: 37, description: "MCM을 즉시 인식하게 하는 시그니처 모노그램" },
      { id: 2, name: "MOBILITY", ratio: 29, description: "여행과 이동이라는 MCM의 본질적인 가치" },
      { id: 3, name: "COGNAC COLOR", ratio: 22, description: "브랜드 헤리티지를 보여주는 따뜻한 코냑 색감" },
      { id: 4, name: "GEOMETRIC STRUCTURE", ratio: 12, description: "트렁크에서 이어지는 입체적이고 기하학적인 형태" }
    ]
  },
  2: {
    dna: [
      { id: 1, name: "VISETOS", ratio: 34, description: "MCM을 즉시 인식하게 하는 시그니처 모노그램" },
      { id: 2, name: "VISIBLE IDENTITY", ratio: 28, description: "도시적 이동성과 대담한 브랜드 상징성" },
      { id: 3, name: "METAL STUDS", ratio: 23, description: "피라미드 스터드로 표현하는 대담한 디테일" },
      { id: 4, name: "MOBILITY", ratio: 15, description: "여행과 이동이라는 MCM의 본질적인 가치" }
    ]
  },
  3: {
    dna: [
      { id: 1, name: "VISETOS", ratio: 35, description: "MCM을 즉시 인식하게 하는 시그니처 모노그램" },
      { id: 2, name: "CULTURAL COLLABORATION", ratio: 30, description: "음악 및 스트리트 문화와의 자유로운 융합" },
      { id: 3, name: "MIAMI BLUE", ratio: 20, description: "선명하고 에너제틱한 시그니처 컬러" },
      { id: 4, name: "ADAPTIVE STYLING", ratio: 15, description: "상황에 따라 다채롭게 변형되는 크로스바디 파우치 형태" }
    ]
  }
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

  const [currentScreen, setCurrentScreen] = useState(1);
  const [currentTime, setCurrentTime] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 데이터 State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [dnaAnalysis, setDnaAnalysis] = useState([]);
  const [heritageLocks, setHeritageLocks] = useState([]);
  const [futureContexts, setFutureContexts] = useState([]);

  // 애니메이션 & 로딩
  const [loading, setLoading] = useState(false);
  const [dnaProgressValues, setDnaProgressValues] = useState([]);

  // 시계
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // API 호출 메서드들
  const fetchProducts = async () => {
    if (!API_BASE_URL) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const result = await res.json();
      if (result.success && result.data?.products) {
        setProducts(result.data.products);
      }
    } catch (err) {
      console.warn("Products API 호출 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDnaAnalysis = async (productId) => {
    const selectedData = PRODUCT_DNA_DATA[productId]?.dna || PRODUCT_DNA_DATA[1].dna;
    const fallbackDna = selectedData.map(item => ({ id: item.id, name: item.name, ratio: item.ratio }));

    const applyProgressAnimation = (analysisData) => {
      setDnaProgressValues(analysisData.map(() => 0));
      setTimeout(() => {
        setDnaProgressValues(analysisData.map((item) => item.ratio));
      }, 200);
    };

    if (!API_BASE_URL) {
      setDnaAnalysis(fallbackDna);
      applyProgressAnimation(fallbackDna);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/dna`);
      const data = await res.json();
      const analysisData = data.dnaAnalysis || fallbackDna;
      setDnaAnalysis(analysisData);
      applyProgressAnimation(analysisData);
    } catch (err) {
      console.warn("DNA Analysis API 호출 실패:", err);
      setDnaAnalysis(fallbackDna);
      applyProgressAnimation(fallbackDna);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeritageLocks = async (productId) => {
    const selectedData = PRODUCT_DNA_DATA[productId]?.dna || PRODUCT_DNA_DATA[1].dna;
    const fallbackLocks = selectedData.map(item => ({ id: item.id, name: item.name, description: item.description }));

    if (!API_BASE_URL) {
      setHeritageLocks(fallbackLocks);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/heritage-locks`);
      const data = await res.json();
      setHeritageLocks(data.heritageLockOptions || fallbackLocks);
    } catch (err) {
      console.warn("Heritage Locks API 호출 실패:", err);
      setHeritageLocks(fallbackLocks);
    } finally {
      setLoading(false);
    }
  };

  const fetchFutureContexts = async () => {
    const fallbackContexts = [
      { id: 1, name: "Space Travel", description: "무중력 이동과 행성 간 여행을 위한 미래 환경" },
      { id: 2, name: "Hyper City", description: "초고밀도 도시의 빠른 이동과 스마트한 보안 환경" },
      { id: 4, name: "Virtual Dimension", description: "현실과 디지털 정체성이 연결된 융합 공간" }
    ];

    if (!API_BASE_URL) {
      setFutureContexts(fallbackContexts);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/future-contexts`);
      const data = await res.json();
      const list = data.futureContexts || fallbackContexts;
      setFutureContexts(list.filter((env) => env.id !== 3 && env.name !== "Climate Adaptation"));
    } catch (err) {
      console.warn("Future Contexts API 호출 실패:", err);
      setFutureContexts(fallbackContexts);
    } finally {
      setLoading(false);
    }
  };

  const goToScreen = (screenNum) => {
    setCurrentScreen(screenNum);

    if (screenNum === 2) fetchProducts();
    else if (screenNum === 3 && product) fetchDnaAnalysis(product);
    else if (screenNum === 4 && product) fetchHeritageLocks(product);
    else if (screenNum === 5) fetchFutureContexts();
  };

  const handleProductSelect = (productId) => {
    setProduct(productId);
  };

  const handleDnaToggle = (dnaId) => {
    if (!dna.includes(dnaId) && dna.length >= 2) {
      triggerToast('최대 2개까지 선택할 수 있습니다.');
      return;
    }
    toggleDna(dnaId);
  };

  const handleGenerate = () => {
    navigate('/loading');
  };

  const currentProduct = products.find((p) => p.id === product);

  const getEnvIcon = (env) => {
    const icons = { 1: "🚀", 2: "🏙️", 4: "🔮" };
    if (icons[env.id]) return icons[env.id];
    
    const nameLower = (env.name || '').toLowerCase();
    if (nameLower.includes('space')) return "🚀";
    if (nameLower.includes('city')) return "🏙️";
    if (nameLower.includes('virtual')) return "🔮";
    return "✨";
  };

  return (
    <div className={styles['app-container']}>
      {loading && <div className={styles['loading-overlay']}>데이터를 불러오는 중...</div>}

      {/* 미리보기 모달 */}
      <div className={`${styles['modal-overlay']} ${isPreviewModalOpen ? styles.active : ''}`}>
        <div className={styles['modal-card']}>
          <div className={styles['modal-title']}>서비스 미리보기</div>
          <div className={styles['modal-desc']}>
            MCM TIME PORTAL 2076은 브랜드의 헤리티지와 미래 환경을 조합하여 100년 뒤의 MCM 대표 제품을 직접 설계해보는 인터랙티브 서비스입니다.
          </div>
          <button className={styles['modal-close-btn']} onClick={() => setIsPreviewModalOpen(false)}>
            확인
          </button>
        </div>
      </div>

      {/* 토스트 메시지 */}
      <div className={`${styles['toast-msg']} ${showToast ? styles.show : ''}`}>{toastMessage}</div>

      {/* SCREEN 1: Onboarding */}
      <div className={`${styles.screen} ${currentScreen === 1 ? styles.active : ''}`}>
        <header className={styles['top-header']}>
          <div className={styles['header-left']}>
            <span className={styles['num-badge']}>01</span>
            <span className={styles['header-title']}>Onboarding</span>
          </div>
          <div className={styles['header-right']}>
            <span>{currentTime}</span> ···
          </div>
        </header>

        <div className={styles['onboarding-main']}>
          <div className={styles['mcm-logo-box']}>
            <img 
              src="/images/mcm_logo.png" 
              alt="MCM Logo" 
              onError={(e) => (e.target.src = 'https://via.placeholder.com/220?text=MCM')} 
            />
          </div>

          <div className={styles['home-hero']}>
            <div className={styles['home-sub']}>FROM HERITAGE TO THE NEXT CENTURY</div>
            <h1 className={styles['home-title']}>
              MCM TIME<br />PORTAL 2076
            </h1>
            <p className={styles['home-desc']}>
              MCM의 과거를 선택하고<br />다음 세기의 제품을 직접 설계하세요.
            </p>
          </div>

          <div className={styles['button-group']}>
            <button className={styles['btn-primary']} data-text="TIME PORTAL ENTER" onClick={() => goToScreen(2)}>
              TIME PORTAL ENTER
            </button>
            <button className={styles['btn-secondary']} onClick={() => setIsPreviewModalOpen(true)}>
              서비스 미리보기
            </button>
          </div>
        </div>
      </div>

      {/* SCREEN 2: Archive Select */}
      <div className={`${styles.screen} ${currentScreen === 2 ? styles.active : ''}`}>
        <header className={styles['top-header']}>
          <div className={styles['header-left']}>
            <span className={styles['num-badge']}>02</span>
            <span className={styles['header-title']}>Archive Select</span>
          </div>
          <div className={styles['header-right']}>
            <span>{currentTime}</span> ···
          </div>
        </header>

        <div className={styles['progress-bar-wrap']}>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={styles['progress-step']}></div>
          <div className={styles['progress-step']}></div>
          <div className={styles['progress-step']}></div>
        </div>

        <button className={styles['btn-back-link']} onClick={() => goToScreen(1)}>
          ← 이전 단계
        </button>

        <div>
          <div className={styles['sub-caption']}>ARCHIVE 1976–2026</div>
          <h1 className={styles['page-title']}>어떤 MCM에서<br />시작할까요?</h1>
          <p className={styles['page-desc']}>미래로 번역할 아카이브 제품을 선택해주세요.</p>
        </div>

        <div className={styles['product-list']}>
          {products.map((prod) => (
            <div
              key={prod.id}
              className={`${styles['product-card']} ${product === prod.id ? styles.selected : ''}`}
              onClick={() => handleProductSelect(prod.id)}
            >
              <div className={styles['card-img-wrap']}>
                <img src={prod.img || `/images/p2_image${prod.id}_2.png`} alt={prod.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/90?text=MCM')} />
              </div>
              <div className={styles['card-info']}>
                <div className={styles['card-title']}>{prod.name}</div>
                <div className={styles['card-desc']}>{prod.shortDescription}</div>
                <div className={styles['tag-group']}>
                  {prod.tags?.slice(0, 2).map((tag, i) => (
                    <span className={styles.tag} key={i}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles['btn-primary']} data-text="이 제품으로 시작하기" disabled={!product} onClick={() => goToScreen(3)}>
          이 제품으로 시작하기
        </button>
      </div>

      {/* SCREEN 3: DNA Decode */}
      <div className={`${styles.screen} ${currentScreen === 3 ? styles.active : ''}`}>
        <header className={styles['top-header']}>
          <div className={styles['header-left']}>
            <span className={styles['num-badge']}>03</span>
            <span className={styles['header-title']}>DNA Decode</span>
          </div>
          <div className={styles['header-right']}>
            <span>{currentTime}</span> ···
          </div>
        </header>

        <div className={styles['progress-bar-wrap']}>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={styles['progress-step']}></div>
          <div className={styles['progress-step']}></div>
        </div>

        <button className={styles['btn-back-link']} onClick={() => goToScreen(2)}>
          ← 이전 단계
        </button>

        <div>
          <div className={styles['sub-caption']}>HERITAGE ANALYSIS</div>
          <h1 className={styles['page-title']}>이 제품의 DNA를<br />분해해볼게요</h1>
          <p className={styles['page-desc']}>MCM을 MCM답게 만드는 시각적·기능적 요소를 보여줍니다.</p>
        </div>

        {currentProduct && (
          <>
            <div className={styles['product-display-card']}>
              <div className={styles['display-img-box']}>
                <img src={currentProduct.img || `/images/p2_image${currentProduct.id}_2.png`} alt={currentProduct.name} />
              </div>
              <div className={styles['display-title']}>{currentProduct.name}</div>
            </div>

            <div className={styles['dna-stats-container']}>
              {dnaAnalysis.map((item, idx) => (
                <div className={styles['dna-stat-item']} key={idx}>
                  <div className={styles['dna-label-row']}>
                    <span style={{ color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ color: 'var(--primary-blue)' }}>{dnaProgressValues[idx] || 0}%</span>
                  </div>
                  <div className={styles['dna-bar-bg']}>
                    <div className={styles['dna-bar-fill']} style={{ width: `${dnaProgressValues[idx] || 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className={styles['btn-primary']} data-text="Heritage Lock 설정하기" onClick={() => goToScreen(4)}>
          Heritage Lock 설정하기
        </button>
      </div>

      {/* SCREEN 4: Heritage Lock */}
      <div className={`${styles.screen} ${currentScreen === 4 ? styles.active : ''}`}>
        <header className={styles['top-header']}>
          <div className={styles['header-left']}>
            <span className={styles['num-badge']}>04</span>
            <span className={styles['header-title']}>Heritage Lock</span>
          </div>
          <div className={styles['header-right']}>
            <span>{currentTime}</span> ···
          </div>
        </header>

        <div className={styles['progress-bar-wrap']}>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={styles['progress-step']}></div>
        </div>

        <button className={styles['btn-back-link']} onClick={() => goToScreen(3)}>
          ← 이전 단계
        </button>

        <div>
          <div className={styles['sub-caption']}>KEEP THE IDENTITY</div>
          <h1 className={styles['page-title']}>100년 뒤에도 남길<br />MCM DNA를 골라주세요</h1>
          <p className={styles['page-desc']}>최소 1개가 미래 제품에 반드시 유지됩니다.</p>
        </div>

        <div className={styles['dna-grid']}>
          {heritageLocks.map((item) => {
            const isSelected = dna.includes(item.id);
            return (
              <div
                key={item.id}
                className={`${styles['dna-lock-card']} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleDnaToggle(item.id)}
              >
                <div className={styles['dna-card-header']}>
                  <div className={styles['dna-card-title']}>{item.name}</div>
                  {isSelected && <span className={styles['locked-badge']}>LOCKED</span>}
                </div>
                <div className={styles['dna-card-desc']}>{item.description}</div>
              </div>
            );
          })}
        </div>

        <div className={styles['locked-summary-box']}>
          <div className={styles['summary-title']}>Locked DNA</div>
          <div className={styles['summary-content']}>
            {dna.length === 0
              ? '선택된 DNA가 없습니다.'
              : dna
                  .map((id) => heritageLocks.find((d) => d.id === id)?.name?.toUpperCase())
                  .filter(Boolean)
                  .join(' · ')}
          </div>
        </div>

        <button
          className={styles['btn-primary']}
          data-text="미래 환경 선택하기"
          disabled={dna.length === 0}
          onClick={() => goToScreen(5)}
        >
          미래 환경 선택하기
        </button>
      </div>

      {/* SCREEN 5: Environment Select */}
      <div className={`${styles.screen} ${currentScreen === 5 ? styles.active : ''}`}>
        <header className={styles['top-header']}>
          <div className={styles['header-left']}>
            <span className={styles['num-badge']}>05</span>
            <span className={styles['header-title']}>Environment Select</span>
          </div>
          <div className={styles['header-right']}>
            <span>{currentTime}</span> ···
          </div>
        </header>

        <div className={styles['progress-bar-wrap']}>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
          <div className={`${styles['progress-step']} ${styles.active}`}></div>
        </div>

        <button className={styles['btn-back-link']} onClick={() => goToScreen(4)}>
          ← 이전 단계
        </button>

        <div>
          <div className={styles['sub-caption']}>WELCOME TO 2076</div>
          <h1 className={styles['page-title']}>2076년, 이 제품은<br />어디에서 사용될까요?</h1>
          <p className={styles['page-desc']}>미래 환경에 따라 기능과 소재가 자동으로 설계됩니다.</p>
        </div>

        <div className={styles['env-list']}>
          {futureContexts.map((env) => (
            <div
              key={env.id}
              className={`${styles['env-card']} ${environment === env.id ? styles.selected : ''}`}
              onClick={() => setEnvironment(env.id)}
            >
              <div className={styles['env-icon-wrap']}>{getEnvIcon(env)}</div>
              <div className={styles['env-info']}>
                <div className={styles['env-title']}>{env.name}</div>
                <div className={styles['env-desc']}>{env.description}</div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles['btn-primary']} data-text="2076년 제품 생성하기" disabled={!environment} onClick={handleGenerate}>
          2076년 제품 생성하기
        </button>
      </div>
    </div>
  );
}
