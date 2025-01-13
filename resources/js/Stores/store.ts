import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "@/Stores/darkModeSlice";
import compactMenuReducer from "./compactMenuSlice";

export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,
        compactMenu: compactMenuReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
