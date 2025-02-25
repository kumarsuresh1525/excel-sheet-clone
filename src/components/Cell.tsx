import React, { RefObject, useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutSide';

const getColumnLetter = (index: number) => String.fromCharCode(65 + index);

// Converts row & column index into cell key (e.g., "A1", "B2")
const getCellKey = (rowIndex: number, columnIndex: number) =>
  `${getColumnLetter(columnIndex)}${rowIndex + 1}`;

const Cell = ({
  columnIndex,
  rowIndex,
  style,
  data,
  editingCell,
  setEditingCell,
  updateCell,
  setIsClickOutside
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: Record<string, string | number>;
  editingCell: string | null;
  setEditingCell: (key: string | null) => void;
  updateCell: (key: string, value: string) => void;
  setIsClickOutside: any;
}) => {
  const cellKey = getCellKey(rowIndex, columnIndex);
  const isEditing = editingCell === cellKey;
  const cellValue: any = data[cellKey] || '';
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const divRef = useRef<any>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleCellClick = () => {
    setEditingCell(cellKey);
  }

  const handleBlur = (event: any) => {
    console.log("test++", event.target.value)
    // setEditingCell(null);
    // setEditingCell(cellKey);
    // debugger
    updateCell(cellKey, cellValue)
  }

  useClickOutside(inputRef, (event) => {
    console.log("Clicked outside cell:", editingCell, cellKey, cellValue, event, inputRef);
    if (editingCell === cellKey) {
      // setEditingCell(null);
      setIsClickOutside(true)
      updateCell(cellKey, cellValue)
    } else {
      setIsClickOutside(false);
    }
  });


  return (
    <div
      onClick={handleCellClick}
      // ref={divRef}
      style={{
        ...style,
        border: '1px solid #ccc',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        cursor: 'pointer',
        padding: '2px',
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={cellValue}
          onChange={(e) => updateCell(cellKey, e.target.value)}
          // onBlur={handleBlur}
          // onKeyDown={(e) => {
          //   if (e.key === 'Enter') setEditingCell(null);
          // }}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            textAlign: 'center',
            outline: 'none',
          }}
        />
      ) : (
        cellValue
      )}
    </div>
  );
};

export default Cell;
