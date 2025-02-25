// @ts-nocheck
import React, { useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import './styles.css';
import Cell from './Cell';

const evaluateFormula = (formula: string, data: Record<string, string | number>) => {
  if (!isNaN(Number(formula)) || !formula.startsWith('=')) return formula; // If not a formula, return as is

  try {
    // Replace cell references (A1, B2, etc.) with their actual values
    const expr = formula.slice(1).replace(/([A-Z]+[0-9]+)/g, (match: any): any => {
      return data[match] ? parseFloat(String(data[match])) || 0 : 0;
    });

    return new Function(`return (${expr})`)(); // Safely evaluate the expression
  } catch {
    return '#ERR'; // Show error for invalid formulas
  }
};

const Spreadsheet = () => {
  const [data, setData] = useState<Record<string, string | number>>({}); // Stores cell values & formulas
  const [editingCell, setEditingCell] = useState<string | null>(null); // Tracks active cell
  const [isClickOutside, setIsClickOutside] = useState(false);

  const updateCell = (cellKey: string, value: string) => {
    setData((prev) => {
      const newData = { ...prev, [cellKey]: value };
      // // Recalculate all formulas
      console.log("isClickOutside", isClickOutside)
      if (value.startsWith("=") && isClickOutside) {
        console.log("test++ ", value)
        Object.keys(newData).forEach((key) => {
          if (typeof newData[key] === 'string' && newData[key].startsWith('=')) {
            newData[key] = evaluateFormula(newData[key] as string, newData);
          }
        });
      }

      return newData;
    });
  };

  return (
    <AutoSizer style={{ height: '100vh' }}>
      {({ height, width }: { height: number; width: number }) => (
        <Grid
          columnCount={100}
          rowCount={100}
          columnWidth={100}
          rowHeight={30}
          height={height}
          width={width}
        >
          {({ columnIndex, rowIndex, style }) => (
            <Cell
              columnIndex={columnIndex}
              rowIndex={rowIndex}
              style={style}
              data={data}
              editingCell={editingCell}
              setEditingCell={setEditingCell}
              updateCell={updateCell}
              setIsClickOutside={setIsClickOutside}
            />
          )}
        </Grid>
      )}
    </AutoSizer>
  );
};

export default Spreadsheet;
