import { create } from "zustand";

const initialState = {
  product: null,
  dna: [],
  environment: null,
};

const useSurveyStore = create((set) => ({
  ...initialState,

  setProduct: (product) => set({ product }),

  toggleDna: (dna) =>
    set((state) => ({
      dna: state.dna.includes(dna)
        ? state.dna.filter((item) => item !== dna)
        : [...state.dna, dna],
    })),

  setEnvironment: (environment) => set({ environment }),

  resetSurvey: () => set(initialState),
}));

export default useSurveyStore;
