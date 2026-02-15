import type { RootState } from "../../store"

export const selectAllNotes = (state: RootState) =>
  Object.values(state.fileSystem.entities).filter(
    (node) =>
      node?.type === "note" && !node.isTrashed
  )

export const selectFavorites = (state: RootState) =>
  Object.values(state.fileSystem.entities).filter(
    (node) =>
      node?.type === "note" &&
      node.isFavorite &&
      !node.isTrashed
  )

export const selectTrash = (state: RootState) =>
  Object.values(state.fileSystem.entities).filter(
    (node) =>
      node?.type === "note" && node.isTrashed
  )

export const selectChildren = (parentId: string ) => (state: RootState) => {
  const folder = state.fileSystem.entities[parentId]
  if ( !folder || folder.type !== "folder") return []

  return folder.childrenIds.map(
    id => state.fileSystem.entities[id]
  )
}

export const getRootFolders = (state: RootState) => {
  return state.fileSystem.ids
          .filter((id) => state.fileSystem.entities[id].parentId === null)
          .map((id) => state.fileSystem.entities[id]);
}

export const selectBlocksByNote = (noteId: string) => (state: RootState) => {
  const note = state.fileSystem.entities[noteId];

  if (!note || note.type !== "note") return [];
  
  return note.blockIds.map((id) => state.blocks.entities[id]);
}
