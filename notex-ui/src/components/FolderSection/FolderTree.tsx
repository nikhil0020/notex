import React from 'react'
import type { FileSystemNode } from '../../ducks/slice/fileSystemSlice'
import FolderTreeNode from './FolderTreeNode'

type Props = {
  folders: FileSystemNode[],
  level?: number
}

const FolderTree = ({
  folders,
  level = 0,
}: Props) => {

  return (
    <>
      {
        folders.map((folder) => (
          <FolderTreeNode
            key={folder.id}
            folder={folder}
            level={level}
          />
        ))
      }
    </>
  )
}

export default FolderTree