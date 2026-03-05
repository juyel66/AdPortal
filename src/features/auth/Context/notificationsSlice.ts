// src/features/notifications/notificationsSlice.ts
import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  title?: string;
  created_at: string;
  read: boolean;
  user?: string;
  organization?: number | null;
  data?: any;
}

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  },
  loading: false,
  error: null,
  hasMore: false
};

interface FetchNotificationsParams {
  page?: number;
  pageSize?: number;
}

interface FetchNotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
  unread_count?: number;
}

export const fetchNotifications = createAsyncThunk<
  FetchNotificationsResponse,
  FetchNotificationsParams | void,
  { rejectValue: string }
>("notifications/fetchNotifications", async (params, { rejectWithValue }) => {
  try {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    
    const response = await api.get(`/accounts/notifications/?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Failed to fetch notifications");
  }
});

export const markAsRead = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("notifications/markAsRead", async ({ id }, { rejectWithValue }) => {
  try {
    await api.post("/accounts/read-notification/", {
      notification_ids: [parseInt(id)]
    });
    return { id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Failed to mark as read");
  }
});

export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    await api.post("/accounts/read-all-notifications/");
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Failed to mark all as read");
  }
});

export const deleteNotification = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("notifications/deleteNotification", async ({ id }, { rejectWithValue }) => {
  try {
    await api.post("/accounts/delete-notification/", {
      notification_ids: [parseInt(id)]
    });
    return { id };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete notification");
  }
});

export const deleteAllNotifications = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notifications/deleteAllNotifications", async (_, { rejectWithValue }) => {
  try {
    await api.post("/accounts/delete-all-notifications/");
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message || "Failed to delete all notifications");
  }
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
        state.pagination.count += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.count / state.pagination.pageSize);
      }
    },

    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, action.payload);
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach(item => { item.read = true; });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.pagination = {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10
      };
      state.hasMore = false;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    resetNotifications: (state) => {
      state.items = [];
      state.pagination.currentPage = 1;
      state.hasMore = false;
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },

    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        const results = action.payload.results || [];
        const currentPage = action.meta.arg?.page || 1;
        const pageSize = action.meta.arg?.pageSize || 10;

        // Always replace items — each page shows its own set
        state.items = results;
        
        const totalCount = action.payload.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        
        state.pagination = {
          count: totalCount,
          next: action.payload.next,
          previous: action.payload.previous,
          currentPage: currentPage,
          totalPages: totalPages,
          pageSize: pageSize
        };
        
        state.hasMore = !!action.payload.next;
        state.unreadCount = action.payload.unread_count ?? state.items.filter(i => !i.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })
      
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(n => n.id === action.payload.id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(item => { item.read = true; });
        state.unreadCount = 0;
      })
      
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          const wasUnread = !state.items[index].read;
          state.items.splice(index, 1);
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.pagination.count = Math.max(0, state.pagination.count - 1);
          state.pagination.totalPages = Math.ceil(state.pagination.count / state.pagination.pageSize);
        }
      })
      
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
        state.pagination.count = 0;
        state.pagination.totalPages = 1;
        state.hasMore = false;
      });
  }
});

export const {
  addNotification,
  setUnreadCount,
  
  clearNotifications,
  setPage,
  resetNotifications,
  incrementUnreadCount,
  decrementUnreadCount
} = notificationsSlice.actions;

export const selectAllNotifications = (state: { notifications: NotificationsState }) => state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationsState }) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => state.notifications.loading;
export const selectNotificationsError = (state: { notifications: NotificationsState }) => state.notifications.error;
export const selectNotificationsPagination = (state: { notifications: NotificationsState }) => state.notifications.pagination;
export const selectHasMoreNotifications = (state: { notifications: NotificationsState }) => state.notifications.hasMore;

export default notificationsSlice.reducer;