import { createSlice } from '@reduxjs/toolkit';

const studentAddmissionSlice = createSlice({
  name: 'admissionForms',
  initialState: {
    admissionForms: [],
    feeCollections: [],
    offlinePayments: [],
    searchResults: [],
    feeGroups: [],
    feeTypes: [],
    feesMasters: [],
    duesFees: [],
    duesFeesOptions: {},
    quickFeesOptions: {},
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {
    getRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'pending';
    },
    getSuccess: (state, action) => {
      state.admissionForms = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getFeeCollectionsSuccess: (state, action) => {
      state.feeCollections = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getOfflinePaymentsSuccess: (state, action) => {
      state.offlinePayments = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getSearchPaymentsSuccess: (state, action) => {
      state.searchResults = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getFeeGroupsSuccess: (state, action) => {
      state.feeGroups = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getFeeTypesSuccess: (state, action) => {
      state.feeTypes = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getFeesMastersSuccess: (state, action) => {
      state.feesMasters = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getDuesFeesSuccess: (state, action) => {
      state.duesFees = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getDuesFeesOptionsSuccess: (state, action) => {
      state.duesFeesOptions = action.payload || {};
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getQuickFeesOptionsSuccess: (state, action) => {
      state.quickFeesOptions = action.payload || {};
      state.loading = false;
      state.error = null;
      state.status = 'succeeded';
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = 'failed';
      console.error('Error in admission form slice:', action.payload);
    },
    stuffDone: (state) => {
      state.status = 'idle';
      state.loading = false;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFeeCollectionsSuccess,
  getOfflinePaymentsSuccess,
  getSearchPaymentsSuccess,
  getFeeGroupsSuccess,
  getFeeTypesSuccess,
  getFeesMastersSuccess,
  getDuesFeesSuccess,
  getDuesFeesOptionsSuccess,
  getQuickFeesOptionsSuccess,
  getError,
  stuffDone,
} = studentAddmissionSlice.actions;
export default studentAddmissionSlice.reducer;