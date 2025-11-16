import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import { deleteNotification, getNotificationsOfUser, putNotificationAsRead } from "../config/api";

const initialValues = {
  notifications: [

  ],
  currentNotification: null,
  loading: false,
  error: null
};

export const retrieveUserNotifications = createAsyncThunk(
  "notifications/retrieveAll",
  async (accountId, { rejectWithValue }) => {
    try {
      const res = await getNotificationsOfUser(accountId);
      return res;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data)
      } else {
        return rejectWithValue("Error when getting user's notifications")
      }
    }
  }
);

export const retrieveSingleNotification = createAsyncThunk(
  "notifications/retrieve",
  async (notiId, { rejectWithValue }) => {
    try {
      const res = await getNotificationsOfUser(notiId);
      return res;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue("Error when getting notification");
      }
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notiId, { rejectWithValue }) => {
    try {
      await putNotificationAsRead(notiId);
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue("Error when getting notification");
      }
    }
  }
)

export const removeNotification = createAsyncThunk(
  "notifications/delete",
  async (notiId, { rejectWithValue }) => {
    try {
      await deleteNotification(notiId);
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue("Error when deleting notification")
      }
    }
  }
)

const notificationSlice = createSlice({
  name: "notifications",
  initialState:
    initialValues
  ,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(retrieveUserNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(retrieveSingleNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotification = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notifcationId = action.meta.arg;
        state.notifications = state.notifications
          .map(noti =>
            noti.id === notifcationId ? { ...noti, isRead: true } : noti
          )
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = state.notifications
          .filter(noti => noti.id !== action.meta.arg)
      })
      .addMatcher(
        isPending(retrieveUserNotifications, retrieveSingleNotification, markNotificationAsRead, removeNotification),
        (state, action) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(retrieveUserNotifications, retrieveSingleNotification, markNotificationAsRead, removeNotification),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
  }
})

export default notificationSlice.reducer;