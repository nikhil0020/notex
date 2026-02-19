import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { updateHandwritingBlock } from '../../ducks/slice/blocksSlice';
import type { HandWritingBlock, Stroke } from '../../ducks/slice/blocksSlice';
import styles from './blockStyles.module.css';

type Props = {
  block: HandWritingBlock;
  isFocused: boolean;
  onFocus: () => void;
};

const HandwritingBlock: React.FC<Props> = ({ block, isFocused, onFocus }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(300); // Initial height
  const currentStrokeRef = useRef<Stroke | null>(null);
  const originalCanvasWidthRef = useRef<number | null>(null); // Track original canvas width for scaling
  const dispatch = useDispatch();

  const MIN_CANVAS_HEIGHT = 300;
  const EXPAND_THRESHOLD = 50; // Expand when within 50px of bottom
  const EXPAND_AMOUNT = 200; // Expand by 200px each time

  const redrawStrokes = useCallback((ctx: CanvasRenderingContext2D, strokes: Stroke[], scaleX: number = 1) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    strokes.forEach((stroke) => {
      if (stroke.points.length === 0) return;

      ctx.strokeStyle = stroke.color;
      // Scale line width proportionally
      ctx.lineWidth = stroke.width * scaleX;
      ctx.beginPath();

      const firstPoint = stroke.points[0];
      ctx.moveTo(firstPoint.x * scaleX, firstPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        ctx.lineTo(point.x * scaleX, point.y);
      }

      ctx.stroke();
    });
  }, []);

  // Calculate required canvas height based on strokes
  const calculateRequiredHeight = useCallback((strokes: Stroke[]): number => {
    if (strokes.length === 0) return MIN_CANVAS_HEIGHT;
    
    let maxY = 0;
    strokes.forEach((stroke) => {
      stroke.points.forEach((point) => {
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Add padding and ensure minimum height
    return Math.max(MIN_CANVAS_HEIGHT, maxY + 100);
  }, []);

  // Initialize canvas and redraw strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate required height from existing strokes
    const requiredHeight = calculateRequiredHeight(block.strokes);
    setCanvasHeight(requiredHeight);

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const currentWidth = rect.width;
    
    // Set original width reference if not set (first load)
    if (originalCanvasWidthRef.current === null) {
      if (block.strokes.length > 0) {
        // Try to infer from the maximum x coordinate in strokes
        // Add some padding to account for margins
        let maxX = 0;
        block.strokes.forEach((stroke) => {
          stroke.points.forEach((point) => {
            maxX = Math.max(maxX, point.x);
          });
        });
        // Use the larger of current width or inferred width (with padding)
        // This ensures strokes don't get cut off
        originalCanvasWidthRef.current = Math.max(currentWidth, maxX * 1.1);
      } else {
        // No strokes yet, use current width as reference
        originalCanvasWidthRef.current = currentWidth;
      }
    }

    canvas.width = currentWidth;
    canvas.height = requiredHeight;

    // Set drawing styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Calculate scale factor based on original width
    const scaleX = originalCanvasWidthRef.current && originalCanvasWidthRef.current > 0 
      ? currentWidth / originalCanvasWidthRef.current 
      : 1;

    // Redraw existing strokes with scaling
    redrawStrokes(ctx, block.strokes, scaleX);
  }, [block.strokes, redrawStrokes, calculateRequiredHeight]);

  // Handle window resize - scale strokes to fit new canvas width
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx || originalCanvasWidthRef.current === null) return;

      const rect = canvas.getBoundingClientRect();
      const newWidth = rect.width;
      const currentHeight = canvas.height;

      // Update canvas size
      canvas.width = newWidth;
      canvas.height = currentHeight;

      // Set drawing styles
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Calculate scale factor
      const scaleX = originalCanvasWidthRef.current && originalCanvasWidthRef.current > 0 
        ? newWidth / originalCanvasWidthRef.current 
        : 1;

      // Redraw strokes with new scale
      redrawStrokes(ctx, block.strokes, scaleX);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [block.strokes, redrawStrokes]);

  // Update canvas size when height changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || originalCanvasWidthRef.current === null) return;

    const rect = canvas.getBoundingClientRect();
    const currentWidth = rect.width;
    const currentHeight = canvas.height;

    // Only resize if height changed
    if (currentHeight !== canvasHeight) {
      canvas.width = currentWidth;
      canvas.height = canvasHeight;
      
      // Calculate scale factor
      const scaleX = originalCanvasWidthRef.current && originalCanvasWidthRef.current > 0 
        ? currentWidth / originalCanvasWidthRef.current 
        : 1;
      
      // Redraw strokes after resize with scaling
      redrawStrokes(ctx, block.strokes, scaleX);
    }
  }, [canvasHeight, block.strokes, redrawStrokes]);

  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure: 'touches' in e ? (e.touches[0].force || 0.5) : 0.5,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getPointFromEvent(e);
    if (!point) return;

    setIsDrawing(true);
    onFocus();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set original canvas width reference on first stroke if not set
    if (originalCanvasWidthRef.current === null) {
      const rect = canvas.getBoundingClientRect();
      originalCanvasWidthRef.current = rect.width;
    }

    currentStrokeRef.current = {
      color: '#000000',
      width: 2,
      points: [point],
    };

    ctx.strokeStyle = currentStrokeRef.current.color;
    ctx.lineWidth = currentStrokeRef.current.width;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }, [onFocus]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();

    const point = getPointFromEvent(e);
    if (!point) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Check if we need to expand the canvas
    if (point.y > canvasHeight - EXPAND_THRESHOLD) {
      const newHeight = canvasHeight + EXPAND_AMOUNT;
      
      // Update canvas size immediately
      const rect = canvas.getBoundingClientRect();
      const currentWidth = rect.width;
      canvas.width = currentWidth;
      canvas.height = newHeight;
      
      // Calculate scale factor for existing strokes only
      const scaleX = originalCanvasWidthRef.current && originalCanvasWidthRef.current > 0
        ? currentWidth / originalCanvasWidthRef.current
        : 1;
      
      // Redraw all existing strokes with scaling
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      redrawStrokes(ctx, block.strokes, scaleX);
      
      // Redraw current stroke (don't scale - it's being drawn at current coordinates)
      if (currentStrokeRef.current.points.length > 0) {
        ctx.strokeStyle = currentStrokeRef.current.color;
        ctx.lineWidth = currentStrokeRef.current.width;
        ctx.beginPath();
        
        const firstPoint = currentStrokeRef.current.points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        
        for (let i = 1; i < currentStrokeRef.current.points.length; i++) {
          const p = currentStrokeRef.current.points[i];
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      
      // Update state
      setCanvasHeight(newHeight);
    }

    // Add point to current stroke
    currentStrokeRef.current.points.push(point);

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }, [isDrawing, canvasHeight, block.strokes, redrawStrokes]);

  const stopDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();

    setIsDrawing(false);

    // Normalize stroke coordinates to reference width before saving
    const canvas = canvasRef.current;
    if (canvas && originalCanvasWidthRef.current && currentStrokeRef.current) {
      const rect = canvas.getBoundingClientRect();
      const currentWidth = rect.width;
      const scaleFactor = originalCanvasWidthRef.current / currentWidth;
      
      // Create normalized stroke with coordinates scaled to reference width
      const normalizedStroke: Stroke = {
        ...currentStrokeRef.current,
        points: currentStrokeRef.current.points.map(point => ({
          ...point,
          x: point.x * scaleFactor,
        })),
        width: currentStrokeRef.current.width * scaleFactor,
      };
      
      dispatch(updateHandwritingBlock({ id: block.id, stroke: normalizedStroke }));
    } else if (currentStrokeRef.current.points.length > 0) {
      // Fallback: save as-is if reference width not set
      dispatch(updateHandwritingBlock({ id: block.id, stroke: currentStrokeRef.current }));
    }

    currentStrokeRef.current = null;
  }, [isDrawing, block.id, dispatch]);

  return (
    <Box 
      ref={containerRef}
      className={`${styles.block} ${styles.handwritingBlock} ${isFocused ? styles.focused : ''}`}
      onClick={onFocus}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ height: `${canvasHeight}px` }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </Box>
  );
};

export default HandwritingBlock;
