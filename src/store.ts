import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import teamReducer from "./features/Team/teamSlice";
import notificationsReducer from "./features/auth/Context/notificationsSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
