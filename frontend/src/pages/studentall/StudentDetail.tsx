
// import React, { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { getAllStudents, clearStudentError } from '../../redux/StudentAddmissionDetail/studentAddmissionHandle';
// import { getAllFclasses, clearFclassError } from '../../redux/fclass/fclassHandle';

// interface Student {
//   _id: string;
//   admissionNo: string;
//   rollNo: string;
//   firstName: string;
//   lastName: string;
//   class: { _id: string; name: string } | string;
//   section: string;
//   gender: string;
//   dob: string;
//   parents: {
//     father: { name: string; phone: string; occupation: string };
//     mother: { name: string; phone: string; occupation: string };
//   };
// }

// interface Fclass {
//   _id: string;
//   name: string;
//   sections: string[];
// }

// interface RootState {
//   student: {
//     studentsList: Student[];
//     loading: boolean;
//     error: string | null;
//   };
//   fclass: {
//     fclassesList: Fclass[];
//     loading: boolean;
//     error: string | null;
//   };
//   user: {
//     currentUser: { _id: string } | null;
//   };
// }

// const StudentDetailPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const { currentUser } = useSelector((state: RootState) => state.user || {});
//   const { studentsList, loading: studentLoading, error: studentError } = useSelector(
//     (state: RootState) => state.student || { studentsList: [], loading: false, error: null }
//   );
//   const { fclassesList, loading: fclassLoading, error: fclassError } = useSelector(
//     (state: RootState) => state.fclass || { fclassesList: [], loading: false, error: null }
//   );
//   const adminID = currentUser?._id;

//   const [searchType, setSearchType] = useState('All Students');
//   const [classId, setClassId] = useState('');
//   const [section, setSection] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     if (adminID) {
//       dispatch(getAllFclasses(adminID));
//       dispatch(getAllStudents(adminID));
//     } else {
//       toast.error('Please log in to view students', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   }, [adminID, dispatch]);

//   useEffect(() => {
//     if (studentError) {
//       toast.error(studentError, {
//         position: 'top-right',
//         autoClose: 3000,
//         onClose: () => dispatch(clearStudentError()),
//       });
//     }
//     if (fclassError) {
//       toast.error(fclassError, {
//         position: 'top-right',
//         autoClose: 3000,
//         onClose: () => dispatch(clearFclassError()),
//       });
//     }
//   }, [studentError, fclassError, dispatch]);

//   const sectionOptions = useMemo(() => {
//     const selectedClass = fclassesList.find((cls) => cls._id === classId);
//     return selectedClass ? selectedClass.sections.map((sec) => ({ value: sec, label: sec })) : [];
//   }, [classId, fclassesList]);

//   const filteredData = useMemo(() => {
//     let result = [...studentsList];

//     if (searchType === 'By Class and Section') {
//       result = result.filter((student) => {
//         const studentClassId = typeof student.class === 'object' ? student.class._id : student.class;
//         const matchesClass = classId ? studentClassId === classId : true;
//         const matchesSection = section ? student.section.toLowerCase() === section.toLowerCase() : true;
//         return matchesClass && matchesSection;
//       });
//     } else if (searchType === 'Search') {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (student) =>
//           student.admissionNo.toLowerCase().includes(query) ||
//           student.rollNo.toLowerCase().includes(query) ||
//           student.firstName.toLowerCase().includes(query) ||
//           student.lastName.toLowerCase().includes(query)
//       );
//     }

//     return result;
//   }, [studentsList, searchType, classId, section, searchQuery]);

//   const styles = {
//     container: {
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif',
//       maxWidth: '1000px',
//       margin: '0 auto',
//       backgroundColor: '#e8c897',
//       borderRadius: '8px',
//       boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//     },
//     searchSection: {
//       display: 'flex',
//       gap: '10px',
//       alignItems: 'center',
//       marginBottom: '20px',
//       flexWrap: 'wrap' as const,
//     },
//     dropdown: {
//       padding: '10px',
//       borderRadius: '6px',
//       border: '1px solid #ccc',
//       width: '200px',
//       fontSize: '14px',
//     },
//     searchInput: {
//       padding: '10px',
//       borderRadius: '6px',
//       border: '1px solid #ccc',
//       flexGrow: 1,
//       fontSize: '14px',
//       minWidth: '150px',
//     },
//     tableContainer: {
//       background: '#fff',
//       borderRadius: '5px',
//       boxShadow: '0 0 5px rgba(0,0,0,0.1)',
//       padding: '10px',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//     },
//     thTd: {
//       border: '1px solid #ddd',
//       padding: '14px',
//       textAlign: 'left' as const,
//     },
//     th: {
//       backgroundColor: '#f5f5f5',
//       fontWeight: 'bold',
//     },
//     detailsSection: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '20px',
//       marginTop: '20px',
//     },
//     detailBox: {
//       border: '1px solid #ddd',
//       padding: '15px',
//       borderRadius: '6px',
//       backgroundColor: '#f9f9f9',
//     },
//     heading: {
//       marginTop: 0,
//       color: '#333',
//       fontSize: '18px',
//     },
//     loading: {
//       textAlign: 'center' as const,
//       color: '#333',
//       fontSize: '16px',
//       margin: '20px 0',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <div style={styles.searchSection}>
//         <select
//           style={styles.dropdown}
//           value={searchType}
//           onChange={(e) => {
//             setSearchType(e.target.value);
//             setClassId('');
//             setSection('');
//             setSearchQuery('');
//           }}
//         >
//           <option>All Students</option>
//           <option>By Class and Section</option>
//           <option>Search</option>
//         </select>
//         {searchType === 'By Class and Section' && (
//           <>
//             <select
//               style={styles.dropdown}
//               value={classId}
//               onChange={(e) => {
//                 setClassId(e.target.value);
//                 setSection('');
//               }}
//             >
//               <option value="">Select Class</option>
//               {fclassesList.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               style={styles.dropdown}
//               value={section}
//               onChange={(e) => setSection(e.target.value)}
//               disabled={!classId}
//             >
//               <option value="">Select Section</option>
//               {sectionOptions.map((sec) => (
//                 <option key={sec.value} value={sec.value}>
//                   {sec.label}
//                 </option>
//               ))}
//             </select>
//           </>
//         )}
//         {searchType === 'Search' && (
//           <input
//             type="text"
//             placeholder="Search by name, admission no, or roll no"
//             style={styles.searchInput}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         )}
//       </div>

//       {(studentLoading || fclassLoading) && <div style={styles.loading}>Loading...</div>}
//       <div style={styles.tableContainer}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={{ ...styles.thTd, ...styles.th }}>Name</th>
//               <th style={{ ...styles.thTd, ...styles.th }}>Admission No</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((student) => (
//               <tr key={student._id}>
//                 <td style={styles.thTd}>{`${student.firstName} ${student.lastName}`}</td>
//                 <td style={styles.thTd}>{student.admissionNo}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={styles.detailsSection}>
//         <div style={styles.detailBox}>
//           <h3 style={styles.heading}>Class & Section</h3>
//           {filteredData.map((student) => (
//             <div key={student._id}>
//               {typeof student.class === 'object' ? student.class.name : 'N/A'} - {student.section}
//             </div>
//           ))}
//         </div>
//         <div style={styles.detailBox}>
//           <h3 style={styles.heading}>Gender & DOB</h3>
//           {filteredData.map((student) => (
//             <div key={student._id}>
//               {student.gender} | {new Date(student.dob).toLocaleDateString()}
//             </div>
//           ))}
//         </div>
//         <div style={styles.detailBox}>
//           <h3 style={styles.heading}>Parents</h3>
//           {filteredData.map((student) => (
//             <div key={student._id}>
//               Father: {student.parents.father.name} <br />
//               Mother: {student.parents.mother.name}
//             </div>
//           ))}
//         </div>
//       </div>
//       <style jsx>{`
//         .Toastify__toast--error {
//           background: linear-gradient(135deg, #dc3545, #c82333);
//           color: #fff;
//           font-family: Arial, sans-serif;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//           font-size: 1rem;
//         }
//         .Toastify__toast-body {
//           padding: 10px;
//         }
//         .Toastify__close-button {
//           color: #fff;
//           opacity: 0.8;
//           transition: opacity 0.2s ease;
//         }
//         .Toastify__close-button:hover {
//           opacity: 1;
//         }
//         .Toastify__progress-bar {
//           background: rgba(255, 255, 255, 0.3);
//         }
//         tr:hover {
//           background-color: #f1f1f1;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StudentDetailPage;
