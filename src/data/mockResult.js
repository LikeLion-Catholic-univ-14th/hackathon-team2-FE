export const MOCK_RESULT_DATA = {
  source: "mock",
  generationId: "mock-generation-001",
  productName: "Ottomar 비세토스 위켄더",
  category: "Travel Bag",
  imageUrl: "/images/p2_image1_2.png",
  description:
    "MCM의 여행용 캐리어 헤리티지와 시그니처 비세토스를 담은 미래형 위켄더백",
  lockedDna: ["Visetos", "Mobility"],
  futureContext: "Space Travel",
};

export const MOCK_ARCHIVES = [
  {
    id: "mock-generation-001",
    productName: MOCK_RESULT_DATA.productName,
    category: MOCK_RESULT_DATA.category,
    imageUrl: MOCK_RESULT_DATA.imageUrl,
    description: MOCK_RESULT_DATA.description,
    lockedDna: MOCK_RESULT_DATA.lockedDna,
    futureContext: MOCK_RESULT_DATA.futureContext,
  },
  {
    id: "mock-generation-002",
    productName: "Stark 사이드 비세토스 백팩",
    category: "Backpack",
    imageUrl: "/images/p2_image2_2.png",
    description:
      "블랙 비세토스와 피라미드 스터드로 도시적 이동성을 표현한 미래형 백팩",
    lockedDna: ["Visetos", "Visible Identity"],
    futureContext: "Hyper City",
  },
  {
    id: "mock-generation-003",
    productName: "MCM X We The Best 크로스바디 파우치",
    category: "Crossbody Bag",
    imageUrl: "/images/p2_image3_2.png",
    description:
      "코냑 비세토스와 마이애미 블루를 결합한 협업 크로스바디 파우치",
    lockedDna: ["Visetos", "Cultural Collaboration"],
    futureContext: "Virtual Dimension",
  },
];

export const MOCK_ARCHIVE_INSIGHT = {
  mostSelectedDna: "Visetos",
  mostPopularFutureContext: "Space Travel",
};
