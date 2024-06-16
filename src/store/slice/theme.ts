import { PayloadAction, createSlice } from "@reduxjs/toolkit";

function saveToLocalStorage(state: ITheme) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("themeApp", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

function loadFromLocalStorage(): ITheme | undefined {
  try {
    const serialisedState = localStorage.getItem("themeApp");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState) as ITheme;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

type IsDarkEnum = "dark" | "light" | "system";
type ITheme = { isDark: IsDarkEnum };

const initialState: ITheme = {
  isDark: "dark",
};

const slice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setInitialState: state => {
      const themeLocalStorage = loadFromLocalStorage();
      return {
        ...state,
        isDark: themeLocalStorage?.isDark || "dark",
      };
    },
    setIsDark: (state, { payload }: PayloadAction<IsDarkEnum>) => {
      return {
        ...state,
        isDark: payload,
      };
    },
    toggleDark: state => {
      const isDark = state.isDark !== "dark" ? "dark" : "light";
      saveToLocalStorage({ isDark: isDark });
      return {
        ...state,
        isDark: isDark,
      };
    },
  },
});

export const { setIsDark, toggleDark, setInitialState } = slice.actions;
export const themeReducer = slice.reducer;
