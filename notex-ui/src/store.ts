import { configureStore } from "@reduxjs/toolkit";
import fileSystemReducer from './ducks/slice/fileSystemSlice';
import blocksReducer from './ducks/slice/blocksSlice';
import uiReducer from './ducks/slice/uiSlice';

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
    blocks: blocksReducer,
    ui: uiReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch