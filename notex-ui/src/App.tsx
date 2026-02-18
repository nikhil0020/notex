import React, { useState, useRef } from "react";
import { Box, Grid } from "@mui/material";
import NotesSection from "./components/NotesSection/NotesSection";
import FolderSection from "./components/FolderSection/FolderSection";
import NoteEditorSection from "./components/NoteEditorSection/NoteEditorSection";
import ToolBarSection from "./components/ToolBarSection/ToolBarSection";
import { useDispatch, useSelector } from "react-redux";
import { selectCreateNewDialogState } from "./ducks/selector/uiSelector";
import { setCreateNewDialogState, } from "./ducks/slice/uiSlice";
import { createFolder, createNote } from "./ducks/slice/fileSystemSlice";
import CreateNewDialog from "./common/CreateNewDialog";

function App() {
  const [folderWidth, setFolderWidth] = useState(280);
  const [notesWidth, setNotesWidth] = useState(320);
  const createNewDialogState = useSelector(selectCreateNewDialogState);


  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const handleFolderDialogClose = () => {
    dispatch(setCreateNewDialogState({
      open: false,
      title: "",
      value: "",
      parentId: null,
      type: null,
    }));
  }

  const handleCreateFolderConfirmClick = () => {
    if (createNewDialogState.type === "folder") {
      dispatch(createFolder(createNewDialogState.value, createNewDialogState.parentId));
    }

    if (createNewDialogState.type === "note" && createNewDialogState.parentId) {
      dispatch(createNote(createNewDialogState.value, createNewDialogState.parentId));
    }
    handleFolderDialogClose();
  }

  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(setCreateNewDialogState({
      ...createNewDialogState,
      value: e.target.value,
    }))
  }

  const NOTES_MIN = 200;
  const NOTES_MAX = 400;

  // --------------------------
  // FOLDER RESIZE
  // --------------------------
  const startFolderResize = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = folderWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth <= 120) {
        setFolderWidth(0);
      } else {
        setFolderWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // --------------------------
  // NOTES RESIZE
  // --------------------------
  const startNotesResize = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = notesWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);

      if (newWidth >= NOTES_MIN && newWidth <= NOTES_MAX) {
        setNotesWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {/* Folder Section */}
      <Box
        sx={{
          width: folderWidth,
          minWidth: 0,
          background: "#f5f5f5",
          overflow: "auto",
          position: "relative",
          transition: folderWidth === 0 ? "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s" : undefined,
        }}
      >
        <FolderSection />

        {/* Resize Handle */}
        <Box
          onMouseDown={startFolderResize}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "5px",
            height: "100%",
            cursor: "col-resize",
            background: "transparent"
          }}
        />
      </Box>

      {/* Notes Section */}
      <Box
        sx={{
          width: notesWidth,
          minWidth: NOTES_MIN,
          maxWidth: NOTES_MAX,
          background: "#fff",
          overflow: "auto",
          position: "relative",
          borderLeft: "1px solid #ddd"
        }}
      >
        <NotesSection />
        <Box
          onMouseDown={startNotesResize}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "5px",
            height: "100%",
            cursor: "col-resize",
            background: "transparent"
          }}
        />
      </Box>

      {/* Editor Section */}
      <Box
        sx={{
          flex: 1,
          background: "#fafafa",
          overflow: "auto"
        }}
      >
        <Grid container sx={{ height: "100%" }}>
          <Grid size={{ xs: 12 }}>
            <ToolBarSection
              folderWidth={folderWidth}
              resetFolderSidebarWidth={() => setFolderWidth(280)}
            />
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ height: "100%" }}>
            <NoteEditorSection />
          </Grid>
        </Grid>
      </Box>
      <CreateNewDialog
        title={createNewDialogState.title}
        open={createNewDialogState.open}
        onChange={handleNewFolderNameChange}
        onClose={handleFolderDialogClose}
        value={createNewDialogState.value}
        confirmClick={handleCreateFolderConfirmClick}
        type={createNewDialogState.type}
      />
    </Box>
  );
}

export default App;
