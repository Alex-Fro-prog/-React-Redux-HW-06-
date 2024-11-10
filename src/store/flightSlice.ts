import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Ticket } from '../../types/Ticket';

interface FlightsState {
  flights: Ticket[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: FlightsState = {
  flights: [],
  status: 'idle',
};

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async () => {
  const response = await fetch('/db.json');
  return (await response.json()).tickets;
});

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'idle';
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default flightsSlice.reducer;