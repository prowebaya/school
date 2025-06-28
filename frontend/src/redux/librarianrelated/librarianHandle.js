// import axios from 'axios';
// import {
//     getRequest,
//     getSuccess,
//     getFailed,
//     getError,
//     postDone,
//     doneSuccess
// } from './librarianSlice';

// // Get all librarians
// export const getAllLibrarians = () => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Librarians`);
//         if (result.data.message) {
//             dispatch(getFailed(result.data.message));
//         } else {
//             dispatch(getSuccess(result.data));
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }

// // Get librarian details by ID
// export const getLibrarianDetails = (id) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Librarian/${id}`);
//         if (result.data) {
//             dispatch(doneSuccess(result.data));
//         }
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }

// // Update librarian subject or details
// export const updateLibrarianSubject = (librarianId, subject) => async (dispatch) => {
//     dispatch(getRequest());

//     try {
//         await axios.put(`${process.env.REACT_APP_BASE_URL}/LibrarianSubject`, { librarianId, subject }, {
//             headers: { 'Content-Type': 'application/json' },
//         });
//         dispatch(postDone());
//     } catch (error) {
//         dispatch(getError(error));
//     }
// }
