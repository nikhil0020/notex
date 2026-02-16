import {
  createSlice,
  createEntityAdapter,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type NodeType = "folder" | "note";

interface BaseNode {
  id: string
  name: string
  type: NodeType
  createdAt: string
}

export interface FolderNode extends BaseNode {
  parentId: string | null
  type: "folder",
  folderChildrenIds: string[],
  noteChildrenIds: string[],
}

// Notes does not store content directly
export interface NoteNode extends BaseNode {
  type: "note"
  isFavorite: boolean
  parentId: string
  isTrashed: boolean
  blockIds: string[] // for storing different kind of blocks
}

export type FileSystemNode = FolderNode | NoteNode;

const adapter = createEntityAdapter<FileSystemNode>();

const notesFolder: FolderNode = {
  id: "notes",
  name: "Notes",
  type: "folder",
  parentId: null,
  folderChildrenIds: [],
  noteChildrenIds: [],
  createdAt: Date.now().toString(),
}

let initialState = adapter.getInitialState();
initialState = adapter.addOne(initialState, notesFolder)

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    createFolder: {
      reducer(state, action: PayloadAction<FolderNode>) {
        adapter.addOne(state, action.payload);
        const { parentId, id } = action.payload;
        if (parentId) {
          const parent = state.entities[parentId];
          if (parent && parent.type === "folder") {
            parent.folderChildrenIds.push(id);
          }
        }
      },
      prepare(name: string, parentId: string | null) {
        return {
          payload: {
            id: nanoid(),
            name,
            type: "folder" as const,
            parentId,
            createdAt: new Date().toISOString(),
            folderChildrenIds: [],
            noteChildrenIds: [],
          }
        }
      }
    },

    createNote: {
      reducer(state, action: PayloadAction<NoteNode>) {
        adapter.addOne(state, action.payload);
        const {parentId, id} = action.payload;
        const parent = state.entities[parentId];
        if (parent && parent.type === "folder") {
          parent.noteChildrenIds.push(id)
        }
      },

      prepare(name: string, parentId: string) {
        return {
          payload: {
            id: nanoid(),
            name,
            type: "note" as const,
            parentId,
            blockIds: [],
            isFavorite: false,
            isTrashed: false,
            createdAt: new Date().toISOString()
          }
        }
      }
    },

    toggleFavorite(state, action: PayloadAction<string>) {
      const note = state.entities[action.payload];

      if (note?.type === "note" && !note.isTrashed) {
        note.isFavorite = true;
      }
    },

    moveToTrash(state, action: PayloadAction<string>) {
      const note = state.entities[action.payload]
      if (note?.type === "note") {
        note.isTrashed = true;
      }
    },

    restoreFromTrash(state, action: PayloadAction<string>) {
      const note = state.entities[action.payload];

      if (note?.type === "note") {
        note.isTrashed = false;
      }
    },

    permanentlyDelete(state, action: PayloadAction<string>) {
      adapter.removeOne(state, action.payload);
    },

    addBlockToNote(
      state,
      action: PayloadAction<{ noteId: string, blockId: string}>
    ) {
      const note = state.entities[action.payload.noteId]

      if (note?.type === "note") {
        note.blockIds.push(action.payload.blockId)
      }
    }
  }
});

export const {
  createFolder,
  createNote,
  toggleFavorite,
  moveToTrash,
  restoreFromTrash,
  permanentlyDelete,
  addBlockToNote,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;





