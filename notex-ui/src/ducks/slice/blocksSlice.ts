import {
  createSlice,
  createEntityAdapter,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import Delta from "quill-delta";

export type BlockType = "text" | "image" | "handwriting"

interface BaseBlock {
  id: string
  noteId: string
  type: BlockType
  createdAt: string
}

interface TextBlock extends BaseBlock {
  type: "text"
  content: Delta
}

interface ImageBlock extends BaseBlock {
  type: "image"
  url: string
  width: number
  height: number
}

interface HandWritingBlock extends BaseBlock {
  type: "handwriting"
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

export type Block = TextBlock | ImageBlock | HandWritingBlock;
export type { TextBlock, ImageBlock, HandWritingBlock };

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
            content: new Delta(),
            createdAt: new Date().toISOString(),
          }
        }
      },
    },

    updateTextBlock(
      state,
      action: PayloadAction<{ id: string, delta: Delta}>
    ) {
      adapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          content: action.payload.delta,
        },
      })
    },

    deleteTextBlock(
      state,
      action: PayloadAction<string>
    ) {
      adapter.removeOne(state, action.payload);
    },

    addImageBlock: {
      reducer(state, action: PayloadAction<ImageBlock>) {
        adapter.addOne(state, action.payload)
      },
      prepare(noteId: string, url: string, width: number, height: number) {
        return {
          payload: {
            id: nanoid(),
            noteId,
            type: "image" as const,
            url,
            width,
            height,
            createdAt: new Date().toISOString(),
          }
        }
      }
    },

    updateImageBlock(
      state,
      action: PayloadAction<{ id: string, width: number, height: number }>
    ) {
      adapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          width: action.payload.width,
          height: action.payload.height,
        },
      })
    },

    deleteImageBlock(
      state,
      action: PayloadAction<string>
    ) {
      adapter.removeOne(state, action.payload);
    },

    addHandwritingBlock: {
      reducer(state, action: PayloadAction<HandWritingBlock>) {
        adapter.addOne(state, action.payload)
      },
      prepare(noteId: string) {
        return {
          payload: {
            id: nanoid(),
            noteId,
            type: "handwriting" as const,
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
          strokes: [...(state.entities[action.payload.id] as HandWritingBlock)?.strokes || [], action.payload.stroke]
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
  addImageBlock,
  addHandwritingBlock,
  updateTextBlock,
  updateImageBlock,
  updateHandwritingBlock,
  deleteTextBlock,
  deleteImageBlock,
  deleteHandwritingBlock,
} = blocksSlice.actions;

export default blocksSlice.reducer;

