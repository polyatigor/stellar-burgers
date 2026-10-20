import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import { getOrdersApi } from '../utils/burger-api';
import { logoutUser } from './userSlice';

import type { TOrder } from '@utils-types';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  activeRequestId: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  activeRequestId: null,
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return;
        }

        state.isLoading = false;
        state.orders = action.payload;
        state.activeRequestId = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return;
        }

        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки истории заказов';
        state.activeRequestId = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.orders = [];
        state.isLoading = false;
        state.error = null;
        state.activeRequestId = null;
      });
  },
});

export default profileOrdersSlice.reducer;