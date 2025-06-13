import { create } from "zustand";

interface FormStore {
  formSubmitted: boolean;
  setFormSubmitted: (value: boolean) => void;
}

const useFormStore = create<FormStore>((set) => ({
  formSubmitted: false,
  setFormSubmitted: (value) => set({ formSubmitted: value }),
}));

export default useFormStore;
