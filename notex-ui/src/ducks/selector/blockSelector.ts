import { type RootState } from "../../store";

export const selectBlockById = (id: string | null) => (state: RootState) => {
  return id ? state.blocks.entities[id] : null;
}