import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit"
import { getNotiUserSettings, putNotiUserSettings } from "../config/api";

const initialValues = {
  settings: null,
  loading: false,
  error: null
}

export const retrieveAllNotificationSettings = createAsyncThunk(
  "settings/retrieveAll",
  async (accountId, { rejectWithValue }) => {
    try {
      const res = await getNotiUserSettings(accountId);
      return res;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data)
      } else {
        return rejectWithValue("Error when getting user's notification settings")
      }
    }
  }
);

export const updateUserNotificationSettings = createAsyncThunk(
  "settings/update",
  async (settings, { rejectWithValue }) => {
    try {
      await putNotiUserSettings(settings);
      return settings;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data)
      } else {
        return rejectWithValue("Error when updating user's notification settings")
      }
    }
  }
)

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialValues,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveAllNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(updateUserNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addMatcher(isPending(retrieveAllNotificationSettings, updateUserNotificationSettings), (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected(retrieveAllNotificationSettings, updateUserNotificationSettings), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default settingsSlice.reducer;