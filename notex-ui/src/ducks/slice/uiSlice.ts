import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { BlockType } from "./blocksSlice";

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
  selectedBlock?: {
    id: string,
    type: BlockType | null
  } 
  focusedBlockId?: string | null
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
  selectedBlock: {
    id: "",
    type: null
  },
  focusedBlockId: ""
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

    setSelectedTool(state, action: PayloadAction<BlockType>) {
      state.selectedTool = action.payload
    },

    setCreateNewDialogState(state, action: PayloadAction<CreateNewDialogState>) {
      state.folderDialogState = action.payload
    },

    setSelectedBlock(state, action: PayloadAction<{ id: string, type: ToolType}> ) {
      state.selectedBlock = action.payload;
    },

    setFocusedBlock(state, action: PayloadAction<string | null>) {
      state.focusedBlockId = action.payload;
    }
  }
});

export const {
  setCurrentFolder,
  setCurrentNote,
  setSelectedTool,
  setCreateNewDialogState,
  setFocusedBlock,
  setSelectedBlock,
} = uiSlice.actions;

export default uiSlice.reducer;
