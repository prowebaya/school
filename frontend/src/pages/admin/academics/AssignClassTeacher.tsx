import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import {
  getAllClassTeacherAssignments,
  createClassTeacherAssignment,
  updateClassTeacherAssignment,
  deleteClassTeacherAssignment,
  clearClassTeacherAssignmentError,
} from '../../../redux/classteacherassign/classTeacherAssignmentAction';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { getAllSections } from '../../../redux/sectionRelated/sectionHandle';
import { fetchTeachers } from '../../../redux/TeacherAllRelated/teacherManageActions';
import { RootState, AppDispatch } from '../../../redux/store';

// Define interfaces for TypeScript
interface Fclass {
  _id: string;
  name: string;
  sections: string[];
}

interface Section {
  _id: string;
  name: string;
  school?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Teacher {
  _id: string;
  fullName: string;
  teacherId: string;
}

interface ClassTeacherAssignment {
  _id: string;
  class: string;
  section: string;
  teacher: {
    _id: string;
    fullName: string;
    teacherId: string;
  };
  admin: string;
}

interface Option {
  value: string;
  label: string;
}

const AssignClassTeacher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignmentsList, loading, error } = useSelector((state: RootState) => state.classTeacherAssignment || {});
  const { fclassesList, error: fclassError } = useSelector((state: RootState) => state.fclass || {});
  const { sectionsList, error: sectionsSliceError } = useSelector((state: RootState) => state.sections || {});
  const { teachers, error: teacherSliceError } = useSelector((state: RootState) => state.teacherManage || {});
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const adminID = currentUser?._id;

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [classError, setClassError] = useState<string>('');
  const [sectionError, setSectionError] = useState<string>('');
  const [teacherError, setTeacherError] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 5;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllClassTeacherAssignments(adminID));
      dispatch(fetchTeachers(adminID));
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
    } else {
      toast.error('Please log in to view class teacher assignments', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      dispatch(clearClassTeacherAssignmentError());
    }
    if (fclassError) {
      toast.error(`Failed to load classes: ${fclassError}`, { position: 'top-right', autoClose: 3000 });
    }
    if (sectionsSliceError) {
      toast.error(`Failed to load sections: ${sectionsSliceError}`, { position: 'top-right', autoClose: 3000 });
    }
    if (teacherSliceError) {
      toast.error(`Failed to load teachers: ${teacherSliceError}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [error, fclassError, sectionsSliceError, teacherSliceError, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!adminID) {
      toast.error('Please log in to assign class teachers', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!selectedClass) {
      setClassError('The Class field is required.');
      valid = false;
    } else {
      setClassError('');
    }

    if (!selectedSection) {
      setSectionError('The Section field is required.');
      valid = false;
    } else {
      const selectedClassData = fclassesList.find((cls: Fclass) => cls._id === selectedClass);
      if (selectedClassData && !selectedClassData.sections.includes(selectedSection)) {
        setSectionError('Invalid section for selected class');
        valid = false;
      } else {
        setSectionError('');
      }
    }

    if (!selectedTeacher) {
      setTeacherError('The Teacher field is required.');
      valid = false;
    } else {
      setTeacherError('');
    }

    if (valid) {
      setIsDialogOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    const selectedClassData = fclassesList.find((cls: Fclass) => cls._id === selectedClass);
    const payload = {
      class: selectedClassData?.name || selectedClass,
      section: selectedSection,
      teacherId: selectedTeacher,
    };

    if (editId) {
      dispatch(updateClassTeacherAssignment({ id: editId, assignment: payload, adminID }))
        .then(() => {
          toast.success('Class teacher assignment updated successfully', { position: 'top-right', autoClose: 3000 });
          resetForm();
          setIsDialogOpen(false);
        })
        .catch((err: any) => {
          toast.error(err.message || 'Failed to update assignment', { position: 'top-right', autoClose: 3000 });
          setIsDialogOpen(false);
        });
    } else {
      dispatch(createClassTeacherAssignment(payload, adminID))
        .then(() => {
          toast.success('Class teacher assignment added successfully', { position: 'top-right', autoClose: 3000 });
          resetForm();
          setIsDialogOpen(false);
        })
        .catch((err: any) => {
          toast.error(err.message || 'Failed to add assignment', { position: 'top-right', autoClose: 3000 });
          setIsDialogOpen(false);
        });
    }
  };

  const resetForm = () => {
    setSelectedClass('');
    setSelectedSection('');
    setSelectedTeacher('');
    setEditId(null);
    setClassError('');
    setSectionError('');
    setTeacherError('');
  };

  const handleEdit = (assignment: ClassTeacherAssignment) => {
    const classData = fclassesList.find((cls: Fclass) => cls.name === assignment.class);
    setSelectedClass(classData?._id || '');
    setSelectedSection(assignment.section);
    setSelectedTeacher(assignment.teacher._id);
    setEditId(assignment._id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      toast.error('Please log in to delete assignments', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      dispatch(deleteClassTeacherAssignment(id, adminID))
        .then(() => {
          toast.info('Class teacher assignment deleted successfully', { position: 'top-right', autoClose: 3000 });
        })
        .catch((err: any) => {
          toast.error(err.message || 'Failed to delete assignment', { position: 'top-right', autoClose: 3000 });
        });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const filteredAssignments = assignmentsList.filter((assignment: ClassTeacherAssignment) =>
    assignment.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.teacher?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.teacher?.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRecords = filteredAssignments.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + recordsPerPage);

  // Derive class, section, and teacher options
  const classOptions: Option[] = fclassesList.map((cls: Fclass) => ({
    value: cls._id,
    label: cls.name,
  }));
  const sectionOptions: Option[] = selectedClass
    ? fclassesList
        .find((cls: Fclass) => cls._id === selectedClass)
        ?.sections.map((sec: string) => ({ value: sec, label: sec })) || []
    : sectionsList.map((sec: Section) => ({ value: sec.name, label: sec.name }));
  const teacherOptions: { _id: string; label: string }[] = teachers.map((teacher: Teacher) => ({
    _id: teacher._id,
    label: `${teacher.fullName} (${teacher.teacherId})`,
  }));

  return (
    <div className="assign-class-teacher-container">
      <ToastContainer />
      <style>
        {`
          .assign-class-teacher-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, rgb(228, 178, 62), #cfdef3);
            min-height: 100vh;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }

          .form-section, .table-section {
            background: white;
            border-radius: 15px Nes;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .form-section {
            flex: 1;
            max-width: 400px;
          }

          .table-section {
            flex: 2;
          }

          .form-section:hover, .table-section:hover {
            transform: translateY(-5px);
          }

          h2 {
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .form-section label {
            display: block;
            font-size: 16px;
            color: #34495e;
            margin-bottom: 5px;
            font-weight: 600;
          }

          .form-section select {
            width: 100%;
            padding: 10px;
            margin-bottom: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-section select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .error {
            color: #e74c3c;
            font-size: 12px;
            margin-bottom: 10px;
          }

          .teacher-checkboxes {
            margin: 15px 0;
          }

          .teacher-checkboxes label {
            display: block;
            font-size: 14px;
            color: #34495e;
            margin-bottom: 5px;
          }

          .teacher-checkboxes input {
            margin-right: 5px;
          }

          .save-btn {
            background: linear-gradient(90deg, #3498db, #2980b9);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.3s ease, transform 0.1s ease;
          }

          .save-btn:hover {
            background: linear-gradient(90deg, #2980b9, #3498db);
            transform: scale(1.05);
          }

          .table-section .search-bar {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
          }

          .table-section table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .table-section th, .table-section td {
            padding: 12px;
            text-align: center;
            font-size: 15px;
            border-bottom: 1px solid #ddd;
          }

          .table-section th {
            background: #3498db;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
          }

          .table-section tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .table-section tr:hover {
            background-color: #e9ecef;
          }

          .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            margin: 0 5px;
            font-size: 18px;
            transition: color 0.3s ease;
          }

          .edit-btn:hover {
            color: #3498db;
          }

          .delete-btn:hover {
            color: #e74c3c;
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 10px;
          }

          .pagination button {
            background: #3498db;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .pagination button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
          }

          .pagination button:hover:not(:disabled) {
            background: #2980b9;
          }

          @media (max-width: 768px) {
            .assign-class-teacher-container {
              flex-direction: column;
            }

            .form-section, .table-section {
              max-width: 100%;
            }
          }
        `}
      </style>

      {fclassesList.length === 0 && !loading && (
        <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>
          No classes available. Please add classes first.
        </div>
      )}

      {teachers.length === 0 && !loading && (
        <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>
          No teachers available. Please add teachers first.
        </div>
      )}

      {/* Form Section */}
      <div className="form-section">
        <h2>{editId ? 'Edit Class Teacher Assignment' : 'Assign Class Teacher'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Class <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection(''); // Reset section when class changes
            }}
            disabled={loading || !adminID}
          >
            <option value="">Select</option>
            {classOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {classError && <div className="error">{classError}</div>}

          <label>Section <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={loading || !adminID || !selectedClass}
          >
            <option value="">Select</option>
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {sectionError && <div className="error">{sectionError}</div>}

          <label>Class Teacher <span style={{ color: 'red' }}>*</span></label>
          <div className="teacher-checkboxes">
            {teacherOptions.map((teacher) => (
              <label key={teacher._id}>
                <input
                  type="checkbox"
                  checked={selectedTeacher === teacher._id}
                  onChange={() => setSelectedTeacher(teacher._id === selectedTeacher ? '' : teacher._id)}
                  disabled={loading || !adminID}
                />
                {teacher.label}
              </label>
            ))}
          </div>
          {teacherError && <div className="error">{teacherError}</div>}

          <button type="submit" className="save-btn" disabled={loading || !adminID}>
            {editId ? 'Update' : 'Save'}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <h2>Class Teacher List</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Class Teacher</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            ) : paginatedAssignments.length === 0 ? (
              <tr>
                <td colSpan={4}>No assignments found</td>
              </tr>
            ) : (
              paginatedAssignments.map((assignment: ClassTeacherAssignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.class}</td>
                  <td>{assignment.section}</td>
                  <td>{assignment.teacher ? `${assignment.teacher.fullName} (${assignment.teacher.teacherId})` : 'N/A'}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(assignment)}
                      title="Edit"
                      disabled={loading || !adminID}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(assignment._id)}
                      title="Delete"
                      disabled={loading || !adminID}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <p>
            Records: {startIndex + 1} to {Math.min(startIndex + recordsPerPage, totalRecords)} of {totalRecords}
          </p>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            {'<'}
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            {'>'}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Confirm Update Assignment' : 'Confirm Add Assignment'}</DialogTitle>
        <DialogContent>
          <Typography>
            {editId ? 'Are you sure you want to update this assignment?' : 'Are you sure you want to add this assignment?'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Class: {classOptions.find((opt) => opt.value === selectedClass)?.label || 'N/A'}<br />
            Section: {selectedSection}<br />
            Teacher: {teacherOptions.find((t) => t._id === selectedTeacher)?.label || 'N/A'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="success">
            {editId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignClassTeacher;