// import { createSlice } from '@reduxjs/toolkit';

// const librarianSlice = createSlice({
//     name: 'librarians',
//     initialState: {
//         librariansList: [], // ✅ Renamed `data` to `librariansList`
//         librarianDetails: null,
//         status: 'idle',
//         error: null
//     },
//     reducers: {
//         getRequest: (state) => {
//             state.status = 'loading';
//         },
//         getSuccess: (state, action) => {
//             state.librariansList = action.payload; // ✅ Ensure correct state key
//             state.status = 'success';
//         },
//         getFailed: (state, action) => {
//             state.error = action.payload;
//             state.status = 'failed';
//         },
//         getError: (state, action) => {
//             state.error = action.payload;
//             state.status = 'error';
//         },
//         doneSuccess: (state, action) => {
//             state.librarianDetails = action.payload;
//             state.status = 'success';
//         },
//         postDone: (state) => {
//             state.status = 'done';
//         } // ✅ Fixed missing closing brace
//     }
// // });

// // Export actions and reducer
// export const { getRequest, getSuccess, getFailed, getError, doneSuccess, postDone } = librarianSlice.actions;
// export default librarianSlice.reducer;
