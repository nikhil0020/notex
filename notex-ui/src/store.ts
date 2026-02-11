import { configureStore } from "@reduxjs/toolkit";
import fileSystemReducer from './ducks/slice/fileSystemSlice';
import blocksReducer from './ducks/slice/blocksSlice';

export const store = configureStore({
  reducer: {
    fileSystem: fileSystemReducer,
    blocks: blocksReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch