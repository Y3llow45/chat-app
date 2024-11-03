import { configureStore } from '@reduxjs/toolkit';
import friendsReducer from './friendsSlice';

export const store = configureStore({
  reducer: {
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
