import type { RootState } from "../../store"
import type { NodeType } from "../slice/fileSystemSlice"

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

export const selectFolderById = (folderId: string) => (state: RootState) => {
  const node = state.fileSystem.entities[folderId];
  if (node?.type === "folder") {
    return node;
  }
  return null;
}

export const selectNoteById = (noteId: string) => (state: RootState) => {
  const node = state.fileSystem.entities[noteId];
  if (node?.type === "note") {
    return node;
  }
  return null;
}

export const selectChildren = (parentId: string, type: NodeType) => (state: RootState) => {
  const folder = state.fileSystem.entities[parentId]
  if ( folder && folder.type === "folder" )  { 
    return folder.childrenIds.map(
      id => state.fileSystem.entities[id]
    ).filter(node => node?.type === type)
  }

  return [];
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
