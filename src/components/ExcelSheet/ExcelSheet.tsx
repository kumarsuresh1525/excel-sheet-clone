import React, { useEffect } from 'react';
import { useState, useCallback, useRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { evaluate } from 'mathjs';
import { Cell } from '../Cell';
import './ExcelSheet.css';
import {
  COLUMN_WIDTH,
  COLUMNS,
  HEADER_HEIGHT,
  HEADER_WIDTH,
  ROW_HEIGHT,
  ROWS,
} from '../../constants/constant';
import { CellData, CellPosition } from '../../types/excel.types';
import { Header } from '../Header';

const ExcelSheet: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: CellData }>({});
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const gridRef = useRef<Grid>(null);

  const getCellKey = useCallback(
    (row: number, col: number) => `${row},${col}`,
    [],
  );

  const getCellValue = useCallback(
    (row: number, col: number) => {
      const key = getCellKey(row, col);
      return data[key]?.value || '';
    },
    [data, getCellKey],
  );

  const setCellValue = useCallback(
    (row: number, col: number, value: string) => {
      const key = getCellKey(row, col);
      setData((prevData) => ({
        ...prevData,
        [key]: { value, formula: value },
      }));
    },
    [getCellKey],
  );

  const evaluateFormula = useCallback((formula: string) => {
    try {
      const result = evaluate(formula);
      return result.toString();
    } catch (error) {
      return '#ERROR';
    }
  }, []);

  const updateFormulas = useCallback(() => {
    setData((prevData) => {
      const newData = { ...prevData };
      Object.entries(newData).forEach(([key, cellData]) => {
        if (cellData.formula.startsWith('=')) {
          const formulaWithReferences = cellData.formula
            .slice(1)
            .replace(/[A-Z]+\d+/g, (match) => {
              const col = match.match(/[A-Z]+/)![0];
              const row = Number.parseInt(match.match(/\d+/)![0]) - 1;
              const colIndex =
                col
                  .split('')
                  .reduce(
                    (acc, char) => acc * 26 + char.charCodeAt(0) - 64,
                    0,
                  ) - 1;
              return getCellValue(row, colIndex);
            });
          newData[key] = {
            ...cellData,
            value: evaluateFormula(formulaWithReferences),
          };
        }
      });
      return newData;
    });
  }, [getCellValue, evaluateFormula]);

  useEffect(() => {
    const intervalId = setInterval(updateFormulas, 1000);
    return () => clearInterval(intervalId);
  }, [updateFormulas]);

  const CellWrapper = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const isEditing =
      editingCell?.row === rowIndex && editingCell?.col === columnIndex;
    const cellKey = getCellKey(rowIndex, columnIndex);
    const cellData = data[cellKey] || { value: '', formula: '' };

    const handleDoubleClick = () => {
      setEditingCell({ row: rowIndex, col: columnIndex });
    };

    const handleChange = (value: string) => {
      setCellValue(rowIndex, columnIndex, value);
    };

    return (
      <Cell
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        style={style}
        isEditing={isEditing}
        value={cellData.value}
        formula={cellData.formula}
        onClick={handleDoubleClick}
        onChange={handleChange}
      />
    );
  };

  return (
    <AutoSizer className="excel-container" style={{ height: '100vh' }}>
      {({ height, width }: { height: number; width: number }) => {
        return (
          <>
            {/* Column Headers */}
            <div style={{ marginLeft: HEADER_WIDTH }}>
              <Grid
                columnCount={COLUMNS}
                columnWidth={COLUMN_WIDTH}
                height={HEADER_HEIGHT}
                rowCount={1}
                rowHeight={HEADER_HEIGHT}
                width={width - HEADER_WIDTH}
              >
                {({ columnIndex, style }) => (
                  <Header index={columnIndex} style={style} type="column" />
                )}
              </Grid>
            </div>

            {/* Row Headers */}
            <div style={{ float: 'left', height: height - HEADER_HEIGHT }}>
              <Grid
                columnCount={1}
                columnWidth={HEADER_WIDTH}
                height={height - HEADER_HEIGHT}
                rowCount={ROWS}
                rowHeight={ROW_HEIGHT}
                width={HEADER_WIDTH}
              >
                {({ rowIndex, style }) => (
                  <Header index={rowIndex} style={style} type="row" />
                )}
              </Grid>
            </div>
            <div style={{ marginLeft: HEADER_WIDTH }}>
              <Grid
                ref={gridRef}
                columnCount={COLUMNS}
                columnWidth={COLUMN_WIDTH}
                height={height - HEADER_HEIGHT}
                rowCount={ROWS}
                rowHeight={ROW_HEIGHT}
                width={width - HEADER_WIDTH}
                itemData={data}
              >
                {CellWrapper}
              </Grid>
            </div>
          </>
        );
      }}
    </AutoSizer>
  );
};

export default ExcelSheet;
