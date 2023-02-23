import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Service from '../../service';

export interface IData {
    id: string;
    ticker: string;
    companyName: string;
    exchange: string;
    performance: Array<Array<[number, number]>>[];
}

export interface IError {
  code?: string;
  message?: string;
}

export interface IChartState {
    loading: boolean,
    error: IError | null,   
    data: IData | null,
}
  
const initialState: IChartState = {
    loading: false,
    error: null,
    data: null,
};

export const getData = createAsyncThunk(
    'chart/getData',
    async (ticker: string) => {
        const res = await Service.get(ticker);
      
        return res.data;
    }
  );

export const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getData.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
  
        })
        .addCase(getData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error;
        });
    },
  });
  
  export const selectLoading = (state: RootState) => state.chart.loading;
  export const selectError = (state: RootState) => state.chart.error;
  export const selectData = (state: RootState) => state.chart.data;
  
  export default chartSlice.reducer;