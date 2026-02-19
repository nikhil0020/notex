import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { updateTextBlock } from '../../ducks/slice/blocksSlice';
import type { TextBlock as TextBlockType } from '../../ducks/slice/blocksSlice';
import { configureQuillFormats } from '../../utils/quillConfig';
import styles from './blockStyles.module.css';

type Props = {
  block: TextBlockType;
  isFocused: boolean;
  onFocus: () => void;
};

const TextBlock: React.FC<Props> = ({ block, isFocused, onFocus }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!quillRef.current || quillInstanceRef.current) return;

    // Configure Quill formats globally (only once)
    configureQuillFormats();

    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      modules: {
        toolbar: false, // Toolbar is handled globally
      },
      placeholder: 'Start typing...',
    });

    // Set initial content
    if (block.content) {
      quill.setContents(block.content);
    }

    // Handle text changes
    quill.on('text-change', () => {
      const delta = quill.getContents();
      dispatch(updateTextBlock({ id: block.id, delta }));
    });

    // Handle focus
    quill.on('selection-change', (range) => {
      if (range) {
        onFocus();
      }
    });

    quillInstanceRef.current = quill;

    return () => {
      quill.off('text-change');
      quill.off('selection-change');
    };
  }, [block.id, block.content, dispatch, onFocus]);

  // Update content when block changes externally
  useEffect(() => {
    if (quillInstanceRef.current && block.content) {
      const currentContent = quillInstanceRef.current.getContents();
      const blockContent = block.content;
      
      // Only update if content is different
      if (JSON.stringify(currentContent) !== JSON.stringify(blockContent)) {
        const selection = quillInstanceRef.current.getSelection();
        quillInstanceRef.current.setContents(blockContent);
        if (selection) {
          quillInstanceRef.current.setSelection(selection);
        }
      }
    }
  }, [block.content]);

  // Focus the editor when block becomes focused
  useEffect(() => {
    if (isFocused && quillInstanceRef.current) {
      quillInstanceRef.current.focus();
    }
  }, [isFocused]);

  // Listen for formatting commands from toolbar
  useEffect(() => {
    const handleFormat = (e: CustomEvent<{ format: string; value?: string | number }>) => {
      if (!isFocused || !quillInstanceRef.current) return;
      
      const { format, value } = e.detail;
      const quill = quillInstanceRef.current;
      
      // Get current selection
      const range = quill.getSelection();
      if (!range) {
        // If no selection, select all text
        quill.setSelection(0, quill.getLength());
      }
      
      // Map font size values to Quill format
      if (format === 'size') {
        const sizeMap: Record<string, string> = {
          'small': '12px',
          'large': '20px',
          'huge': '32px',
        };
        const fontSize = sizeMap[value as string];
        if (fontSize) {
          quill.format('size', fontSize);
        } else if (value === '') {
          // Normal size - remove size formatting
          quill.format('size', false);
        }
      } else if (format === 'font') {
        if (value && value !== '') {
          quill.format('font', value as string);
        } else {
          quill.format('font', false);
        }
      } else {
        // Toggle format for bold, italic, underline
        const currentFormat = quill.getFormat();
        const isActive = currentFormat[format];
        quill.format(format, !isActive);
      }
    };

    window.addEventListener('quill-format' as any, handleFormat as EventListener);
    
    return () => {
      window.removeEventListener('quill-format' as any, handleFormat as EventListener);
    };
  }, [isFocused]);

  return (
    <Box 
      className={`${styles.block} ${styles.textBlock} ${isFocused ? styles.focused : ''}`}
      onClick={onFocus}
    >
      <div ref={quillRef} />
    </Box>
  );
};

export default TextBlock;
