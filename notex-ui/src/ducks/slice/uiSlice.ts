import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

type ToolType = "text" | "handwriting" | "image"

interface UIState {
  currentFolderId: string | null
  currentNoteId: string | null
  selectedTool: ToolType 
  isFolderSidebarOpen: boolean
  isNotesSidebarOpen: boolean
  newFolderCount: number,
}

const initialState: UIState = {
  currentFolderId: null,
  currentNoteId: null,
  selectedTool: "text",
  isFolderSidebarOpen: true,
  isNotesSidebarOpen: true,
  newFolderCount: 0,
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

    toogleFolderSidebar(state) {
      state.isFolderSidebarOpen = !state.isFolderSidebarOpen
    },

    toogleNotesSidebar(state) {
      state.isNotesSidebarOpen = !state.isNotesSidebarOpen
    }
  }
});

export const {
  setCurrentFolder,
  setCurrentNote,
  setSelectedTool,
  toogleFolderSidebar,
  toogleNotesSidebar
} = uiSlice.actions;

export default uiSlice.reducer;
