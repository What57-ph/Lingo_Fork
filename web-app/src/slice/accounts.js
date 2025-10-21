import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAccount, enableAccount, getAllAccounts, handleApiError, removeAccount, updateAccount } from "../config/api";
import { toast } from "react-toastify";

const initialState = {
  accounts: [

  ],
  pageNo: 0,
  pageSize: 10,
  meta: {},
  loading: false,
  error: null
};


export const retrieveAccounts = createAsyncThunk(
  "accounts/retrieveAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getAllAccounts(params);
      return res;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Lỗi không xác định");
    }
  }
);


export const createNewAccount = createAsyncThunk(
  "accounts/create",
  async (userData, thunkAPI) => {
    try {
      const res = await createAccount(userData);
      return res;
    } catch (error) {
      handleApiError(error, "Tạo tài khoản mới thất bại")
      return thunkAPI.rejectWithValue(error?.response?.detail || "Tạo tài khoản mới thất bại");
    }
  }
);

export const updateCurrentAccount = createAsyncThunk(
  "accounts/update",
  async (userData, thunkAPI) => {
    try {
      const res = await updateAccount(userData);
      return res;
    } catch (error) {
      handleApiError(error, "Cập nhật tài khoản thất bại")
      return thunkAPI.rejectWithValue(error?.response?.detail || "Cập nhật tài khoản thất bại");
    }
  }
);

// export const postEnableAccount = createAsyncThunk("accounts/enable", async (params) => await enableAccount(params));

export const postEnableAccount = createAsyncThunk(
  "accounts/enable",
  async (params, { rejectWithValue }) => {
    try {
      const res = await enableAccount(params);
      return res;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue("Lỗi không xác định");
    }
  }
);

export const deleteAccount = createAsyncThunk("accounts/delete", async (params) => await removeAccount(params));

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setPageNo: (state, action) => {
      state.pageNo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveAccounts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(retrieveAccounts.fulfilled, (state, { payload: { meta, result } }) => {
        state.accounts = result;
        state.meta = meta;
        state.loading = false;
        state.error = null;
      })
      .addCase(retrieveAccounts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createNewAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
        state.loading = false;
      })
      .addCase(createNewAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCurrentAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentAccount.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        const index = state.accounts.findIndex(acc => acc.keycloakId === id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
          toast.info("Cập nhật tài khoản thành công");
        }
        state.loading = false;
      })
      .addCase(updateCurrentAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(postEnableAccount.fulfilled, (state, action) => {
        const { id, enable } = action.meta.arg;
        // action.meta.arg chính là params bạn dispatch
        const index = state.accounts.findIndex(acc => acc.keycloakId === id);
        if (index !== -1) {
          state.accounts[index].enable = enable;
          toast.info("Cập nhật trạng thái thành công");
        }
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.accounts = state.accounts.filter(acc => acc.keycloakId !== id);
        toast.info("Xóa tài khoản thành công");
      })
  }
});



export default accountSlice.reducer;