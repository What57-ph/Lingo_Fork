import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allTests } from "../data/MockData";
import { getListTests } from "../config/api";
import { getAllTests } from "../service/TestService";


const initialState = {
  category: "all",
  status: "all",
  search: "",
  sort: "",
  tests: [],
  meta: {},
  loading: false
};

export const retrieveTests = createAsyncThunk("tests/retrieveAll", async (params) => await getAllTests(params));

const testListSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload
    },
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setTests: (state, action) => {
      state.tests = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveTests.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(retrieveTests.fulfilled, (state, { payload: { meta, result } }) => {
        state.tests = result;
        state.meta = meta;
        state.loading = false;
      })

  }

});

export const { setSort, setSearch, setPage, setPageSize, setStatus, setCategory, setTests } = testListSlice.actions;

export default testListSlice.reducer;