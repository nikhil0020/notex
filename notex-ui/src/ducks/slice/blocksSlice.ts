import {
  createSlice,
  createEntityAdapter,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type BlockType = "text" | "draw"

interface BaseBlock {
  id: string
  noteId: string
  type: BlockType
  createdAt: string
}

interface TextBlock extends BaseBlock {
  type: "text"
  content: string,
}

interface DrawingBlock extends BaseBlock {
  type: "draw"
  strokes: Stroke[]
}

export interface Stroke {
  color: string
  width: number
  points: {
    x: number
    y: number
    pressure: number
  }[]
}

export type Block = TextBlock  | DrawingBlock;
export type { TextBlock, DrawingBlock };

const adapter = createEntityAdapter<Block>();

const blocksSlice = createSlice({
  name: "blocks",
  initialState: adapter.getInitialState(),
  reducers: {
    addTextBlock: {
      reducer(state, action: PayloadAction<TextBlock>) {
        adapter.addOne(state, action.payload);
      },
      prepare(noteId: string) {
        return {
          payload: {
            id: nanoid(),
            noteId,
            type: "text" as const,
            content: "",
            createdAt: new Date().toISOString(),
          }
        }
      },
    },

    updateTextBlock(
      state,
      action: PayloadAction<{ id: string, content: string }>
    ) {
      adapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          content: action.payload.content,
        },
      })
    },

    deleteTextBlock(
      state,
      action: PayloadAction<string>
    ) {
      adapter.removeOne(state, action.payload);
    },

    deleteImageBlock(
      state,
      action: PayloadAction<string>
    ) {
      adapter.removeOne(state, action.payload);
    },

    addHandwritingBlock: {
      reducer(state, action: PayloadAction<DrawingBlock>) {
        adapter.addOne(state, action.payload)
      },
      prepare(noteId: string) {
        return {
          payload: {
            id: nanoid(),
            noteId,
            type: "draw" as const,
            strokes: [],
            createdAt: new Date().toISOString()
          }
        }
      }
    },

    updateHandwritingBlock(
      state,
      action: PayloadAction<{ id: string, stroke: Stroke}>
    ) {
      adapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          strokes: [...(state.entities[action.payload.id] as DrawingBlock)?.strokes || [], action.payload.stroke]
        },
      })
    },

    deleteHandwritingBlock(
      state,
      action: PayloadAction<string>
    ) {
      adapter.removeOne(state, action.payload);
    }
  }
});

export const {
  addTextBlock,
  addHandwritingBlock,
  updateTextBlock,
  updateHandwritingBlock,
  deleteTextBlock,
  deleteImageBlock,
  deleteHandwritingBlock,
} = blocksSlice.actions;

export default blocksSlice.reducer;

