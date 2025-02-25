import { configureStore } from '@reduxjs/toolkit';
import gridReducer from './gridSlice';

const store = configureStore({
  reducer: {
    grid: gridReducer,
  },
});

export default store; 