import React, { useState } from 'react'
import type { FileSystemNode, FolderNode } from '../../ducks/slice/fileSystemSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentFolder } from '../../ducks/slice/uiSlice'
import { Box, IconButton, Typography } from '@mui/material'
import FolderTree from './FolderTree'
import { selectChildren } from '../../ducks/selector/systemFolderSelector'
import { ChevronRight, ExpandMore, FolderOpenTwoTone, MenuBook } from '@mui/icons-material'
import { selectCurrentFolderId } from '../../ducks/selector/uiSelector'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FolderMenu from './FolderMenu'

type Props = {
  folder: FileSystemNode,
  level: number,
}

const FolderTreeNode = ({
  folder,
  level,
}: Props) => {

  if (folder.type === "note") {
    return null;
  }

  const [expand, setExpand] = useState(true);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const selectedFolder = useSelector(selectCurrentFolderId);
  const children = useSelector(selectChildren(folder.id)) || []
  const hasChildren = folder.childrenIds && folder.childrenIds.length > 0;
  const isSelected = selectedFolder === folder.id;
  
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentFolder(folder.id))
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpand(!expand);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pl: 1.5 + level * 1.5,
          cursor: "pointer",
          borderRadius: 1,
          backgroundColor: isSelected ? "rgb(47, 129, 217)" : "transparent"
        }}
        onClick={handleClick}
      >
        {
          hasChildren ? (
            <Box
              onClick={toggleExpand}
              sx={{ mr: 1}}
            >
              {
                expand ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />
              }
            </Box>
          ) : (
            <FolderOpenTwoTone
              fontSize="small"
              sx={{
                mr: 0.5,
                color: isSelected ? "white" : "black"
              }}
            />
          )
        }
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? 500: 400,
              color: isSelected ? "white" : "black"
            }}
          >
            {folder.name}
          </Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              setAnchorEl(e.currentTarget)
            }}
          >
            <MoreHorizIcon
              sx={{
                fontSize: "15px",
                color: isSelected ? "white" : "black"
              }}
            />
          </IconButton>
          <FolderMenu
            folderId={folder.id}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        </Box>
      </Box>
      {
        hasChildren && expand && (
          <FolderTree folders={children} level={level + 1}/>
        )
      }
    </Box>
  )
}

export default FolderTreeNode