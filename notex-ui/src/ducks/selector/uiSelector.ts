import { type RootState } from "../../store";

export const selectIsFolderSidebarOpen = (state: RootState) => state.ui.isFolderSidebarOpen;

export const selectIsNoteEditorOpen = (state: RootState) => state.ui.isNotesSidebarOpen;

export const selectCurrentFolderId = (state: RootState) => state.ui.currentFolderId;

export const selectCurrentNoteId = (state: RootState) => state.ui.currentNoteId;

export const selectSelectedTool = (state: RootState) => state.ui.selectedTool;

export const selectNewFolderCount = (state: RootState) => state.ui.newFolderCount;