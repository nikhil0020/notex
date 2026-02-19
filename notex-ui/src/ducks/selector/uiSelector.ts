import { type RootState } from "../../store";

export const selectCurrentFolderId = (state: RootState) => state.ui.currentFolderId;

export const selectCurrentNoteId = (state: RootState) => state.ui.currentNoteId;

export const selectSelectedTool = (state: RootState) => state.ui.selectedTool;

export const selectCreateNewDialogState = (state: RootState) => state.ui.folderDialogState;

export const selectSelectedBlock = (state: RootState) => state.ui.selectedBlock;

export const selectFocusedBlockId = (state: RootState) => state.ui.focusedBlockId;