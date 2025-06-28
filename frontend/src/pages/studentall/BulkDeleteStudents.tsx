import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchAllStudents,
  bulkDeleteStudents,
} from '../../redux/StudentAddmissionDetail/bulkDeleteHandle';
import {
  setSelectedStudents,
  setSearchTerm,
  setVisibleColumns,
  resetBulkDelete,
} from '../../redux/StudentAddmissionDetail/bulkDeleteSlice';
import { RootState, AppDispatch } from '../../redux/store';

const BulkDeleteStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students, selectedStudents, searchTerm, visibleColumns, loading, error, status } = useSelector(
    (state: RootState) => state.bulkDelete
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllStudents(adminID));
    } else {
      toast.error('Please log in to view students', { position: 'top-right', autoClose: 3000 });
    }

    return () => {
      dispatch(resetBulkDelete());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handleSelect = (id: string) => {
    dispatch(
      setSelectedStudents(
        selectedStudents.includes(id)
          ? selectedStudents.filter((sid) => sid !== id)
          : [...selectedStudents, id]
      )
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedStudents(e.target.checked ? students.map((s) => s.id) : []));
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length === 0) {
      toast.warn('No students selected for deletion.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedStudents.length} student(s)?`)) {
      dispatch(bulkDeleteStudents(adminID, selectedStudents)).then(() => {
        toast.success('Students deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  const exportToCSV = () => {
    const csvData = students.map((student) => ({
      'Admission No': student.admissionNo,
      Name: student.name,
      Class: student.class,
      'Date of Birth': student.dob,
      Gender: student.gender,
      'Mobile Number': student.mobile,
    }));
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'Students_Data.xlsx');
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          padding: '25px',
          maxWidth: '950px',
          margin: 'auto',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <ToastContainer />
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px',
            background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
          }}
        >
          Bulk Delete Students
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', color: '#34495e' }}>Loading...</div>
        )}

        {/* Top Controls (Search + Export + Delete) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search students..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            style={searchBarStyle}
          />

          <div>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(students, null, 2))}
              style={buttonStyle}
            >
              📋 Copy
            </button>
            <button onClick={exportToCSV} style={buttonStyle}>
              📊 Excel
            </button>
            <button
              onClick={() => alert('CSV Export Coming Soon!')}
              style={buttonStyle}
            >
              📄 CSV
            </button>
            <button onClick={() => window.print()} style={buttonStyle}>
              🖨️ Print
            </button>
            <button onClick={handleDeleteSelected} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>
              🗑️ Delete Selected
            </button>
          </div>
        </div>

        {/* Column Visibility */}
        <div style={{ marginBottom: '10px' }}>
          {Object.keys(visibleColumns).map((col) => (
            <label key={col} style={{ marginRight: '10px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={visibleColumns[col]}
                onChange={() =>
                  dispatch(
                    setVisibleColumns({
                      ...visibleColumns,
                      [col]: !visibleColumns[col],
                    })
                  )
                }
              />{' '}
              {col.charAt(0).toUpperCase() + col.slice(1)}
            </label>
          ))}
        </div>

        {/* Students Table */}
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={cellStyle}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStudents.length === students.length && students.length > 0}
                />
              </th>
              {visibleColumns.admissionNo && <th style={cellStyle}>Admission No</th>}
              {visibleColumns.name && <th style={cellStyle}>Student Name</th>}
              {visibleColumns.class && <th style={cellStyle}>Class</th>}
              {visibleColumns.dob && <th style={cellStyle}>Date of Birth</th>}
              {visibleColumns.gender && <th style={cellStyle}>Gender</th>}
              {visibleColumns.mobile && <th style={cellStyle}>Mobile Number</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} style={rowStyle}>
                  <td style={cellStyle}>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelect(student.id)}
                    />
                  </td>
                  {visibleColumns.admissionNo && <td style={cellStyle}>{student.admissionNo}</td>}
                  {visibleColumns.name && <td style={cellStyle}>{student.name}</td>}
                  {visibleColumns.class && <td style={cellStyle}>{student.class}</td>}
                  {visibleColumns.dob && <td style={cellStyle}>{student.dob}</td>}
                  {visibleColumns.gender && <td style={cellStyle}>{student.gender}</td>}
                  {visibleColumns.mobile && <td style={cellStyle}>{student.mobile}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={emptyCellStyle}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Styles
const searchBarStyle = {
  padding: '10px',
  width: '250px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '14px',
};
const buttonStyle = {
  padding: '8px 14px',
  margin: '5px',
  borderRadius: 5,
  cursor: 'pointer',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  fontSize: '14px',
};
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  collapse: 'collapse',
  borderRadius: '10px',
  overflow: 'hidden',
};
const headerRowStyle = {
  backgroundColor: '#f5f5f5',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '10px',
};
const cellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'center',
};
const emptyCellStyle = {
  backgroundColor: '#f8f9fa',
  color: '#999',
  textAlign: 'center',
  padding: '10px',
  border: '1px solid #ddd',
};
const rowStyle = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd',
  padding: '10px',
  textAlign: 'center',
};

export default BulkDeleteStudents;