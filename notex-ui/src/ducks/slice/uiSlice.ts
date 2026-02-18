import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

type ToolType = "text" | "handwriting" | "image"

interface CreateNewDialogState {
  open: boolean,
  value: string,
  title: string,
  type: "note" | "folder" | null,
  parentId: string | null,
}
interface UIState {
  currentFolderId: string | null
  currentNoteId: string | null
  selectedTool: ToolType
  folderDialogState: CreateNewDialogState,
}

const initialState: UIState = {
  currentFolderId: "all-notes",
  currentNoteId: null,
  selectedTool: "text",
  folderDialogState: {
    open: false,
    title: "",
    value: "",
    type: null,
    parentId: null
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentFolder(state, action: PayloadAction<string | null>) {
      state.currentFolderId = action.payload;
      state.currentNoteId = null;
    },
    
    setCurrentNote(state, action: PayloadAction<string | null>) {
      state.currentNoteId = action.payload
    },

    setSelectedTool(state, action: PayloadAction<ToolType>) {
      state.selectedTool = action.payload
    },

    setCreateNewDialogState(state, action: PayloadAction<CreateNewDialogState>) {
      state.folderDialogState = action.payload
    },
  }
});

export const {
  setCurrentFolder,
  setCurrentNote,
  setSelectedTool,
  setCreateNewDialogState,
} = uiSlice.actions;

export default uiSlice.reducer;
