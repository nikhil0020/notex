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
  folderDialogState: {
    open: boolean,
    parentId: string | null,
  },
  newFolderName: string,
}

const initialState: UIState = {
  currentFolderId: null,
  currentNoteId: null,
  selectedTool: "text",
  isFolderSidebarOpen: true,
  isNotesSidebarOpen: true,
  newFolderCount: 0,
  folderDialogState: {
    open: false,
    parentId: null,
  },
  newFolderName: "New Folder"
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

    toggleFolderSidebar(state) {
      state.isFolderSidebarOpen = !state.isFolderSidebarOpen
    },

    toggleNotesSidebar(state) {
      state.isNotesSidebarOpen = !state.isNotesSidebarOpen
    },

    setFolderDialogState(state, action: PayloadAction<{ open: boolean, parentId: string | null }>) {
      state.folderDialogState = action.payload

    },

    setNewFolderName(state, action: PayloadAction<string>) {
      state.newFolderName = action.payload;
    }
  }
});

export const {
  setCurrentFolder,
  setCurrentNote,
  setSelectedTool,
  toggleFolderSidebar,
  toggleNotesSidebar,
  setFolderDialogState,
  setNewFolderName,
} = uiSlice.actions;

export default uiSlice.reducer;
