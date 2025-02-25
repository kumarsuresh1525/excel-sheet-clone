import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Cell {
  value: string;
}

interface GridState {
  cells: Cell[][];
}

const initialState: GridState = {
  cells: Array.from({ length: 10000 }, () => Array(10000).fill({ value: '' })),
};

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ row: number; col: number; value: string }>) => {
      const { row, col, value } = action.payload;
      state.cells[row][col] = { value };
    },
  },
});

export const { updateCell } = gridSlice.actions;
export default gridSlice.reducer; 