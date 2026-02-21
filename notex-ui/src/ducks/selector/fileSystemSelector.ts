import type { RootState } from "../../store"
import type { NodeType } from "../slice/fileSystemSlice"

export const selectAllNotes = (state: RootState) =>
  Object.values(state.fileSystem.entities).filter(
    (node) => node?.type === "note" && !node.isTrashed
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
    return {
      ...node,
      blocks: node.blockIds.map(blockId => state.blocks.entities[blockId]).filter((block): block is NonNullable<typeof block> => block !== undefined)
    }
  }
  return null;
}

export const selectChildren = (parentId: string, type: NodeType) => (state: RootState) => {
  if ( type === "folder" )  {
    const folder = state.fileSystem.entities[parentId]
    return folder.type === "folder" ? folder.folderChildrenIds.map(
      id => state.fileSystem.entities[id]
    ) : []
  }

  if (type === "note") {
    const folder = state.fileSystem.entities[parentId]
    return folder.type === "folder" ? folder.noteChildrenIds.map(
      id => state.fileSystem.entities[id]
    ) : []
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
  
  return note.blockIds
    .map((id) => state.blocks.entities[id])
    .filter((block): block is NonNullable<typeof block> => block !== undefined);
}
