
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { StylesConfig } from 'react-select';
import {
  getAllExamResults,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  clearExamResultError,
} from '../../../redux/examRelated/examResultAction';
import { getAllFclasses } from '../../../redux/fclass/fclassHandle';
import { getAllSections } from '../../../redux/sectionRelated/sectionHandle';
import { fetchAdmissionForms } from '../../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { FaPlus, FaMinus } from 'react-icons/fa';

// TypeScript interfaces
interface Subject {
  subjectName: string;
  marksObtained: string | number;
  subjectCode: string;
  grade?: string;
  attendance?: string; // Added to track present/absent
}

interface ExamResult {
  _id?: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  examGroup: string;
  examType: string;
  session: string;
  classId: { _id: string; name: string; sections: string[] };
  section: string;
  subjects: Subject[];
  grandTotal?: number;
  percent?: number;
  rank?: number;
  result?: string;
  gpa?: number;
  overallGrade?: string;
}

interface Fclass {
  _id: string;
  name: string;
  sections: string[];
}

interface AdmissionForm {
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  classId: { _id: string; name: string };
  section: string;
}

interface RootState {
  examResult: {
    examResultsList: ExamResult[];
    loading: boolean;
    error: string | null;
  };
  fclass: {
    fclassesList: Fclass[];
    loading: boolean;
    error: string | null;
  };
  sections: {
    sectionsList: string[];
    loading: boolean;
    error: string | null;
  };
  admissionForms: {
    admissionForms: AdmissionForm[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

// Custom styles for react-select to improve responsiveness
const selectStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    fontSize: '14px',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    maxHeight: '200px',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '100%',
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
  }),
};

// Function to convert marks to Grade Point and Letter Grade
const getGrade = (marks: number): { gpa: number; grade: string } => {
  if (marks > 100 || marks < 0) return { gpa: 0.0, grade: 'N/A' }; // Invalid marks
  if (marks >= 97) return { gpa: 4.0, grade: 'A+' };
  if (marks >= 93) return { gpa: 4.0, grade: 'A' };
  if (marks >= 90) return { gpa: 3.7, grade: 'A-' };
  if (marks >= 87) return { gpa: 3.3, grade: 'B+' };
  if (marks >= 83) return { gpa: 3.0, grade: 'B' };
  if (marks >= 80) return { gpa: 2.7, grade: 'B-' };
  if (marks >= 77) return { gpa: 2.3, grade: 'C+' };
  if (marks >= 73) return { gpa: 2.0, grade: 'C' };
  if (marks >= 70) return { gpa: 1.7, grade: 'C-' };
  if (marks >= 67) return { gpa: 1.3, grade: 'D+' };
  if (marks >= 65) return { gpa: 1.0, grade: 'D' };
  return { gpa: 0.0, grade: 'F' };
};

// Function to calculate GPA, grand total, and overall grade
const calculateGPAandGrade = (subjects: Subject[], creditHoursPerSubject: number = 1): { gpa: number; overallGrade: string; grandTotal: number; percent: number } => {
  const totalMarks = subjects.reduce((sum, subject) => {
    const marks = subject.attendance === 'Absent' ? 0 : Number(subject.marksObtained);
    return sum + (isNaN(marks) || marks < 0 || marks > 100 ? 0 : marks);
  }, 0);
  const maxMarks = subjects.length * 100;
  const grandTotal = totalMarks;
  const percent = maxMarks > 0 ? Number(((totalMarks / maxMarks) * 100).toFixed(2)) : 0.0;

  const totalPoints = subjects.reduce((sum, subject) => {
    const marks = subject.attendance === 'Absent' ? 0 : Number(subject.marksObtained);
    const { gpa } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
    return sum + (gpa * creditHoursPerSubject);
  }, 0);
  const totalCreditHours = subjects.length * creditHoursPerSubject;
  const gpa = totalCreditHours > 0 ? Number((totalPoints / totalCreditHours).toFixed(2)) : 0.0;

  const averagePercent = percent;
  const { grade: overallGrade } = getGrade(averagePercent);

  return { gpa, overallGrade, grandTotal, percent };
};

const ExamResult = () => {
  // State for dropdown selections and form
  const [selectedExamGroup, setSelectedExamGroup] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    admissionNo: '',
    rollNo: '',
    studentName: '',
    examGroup: '',
    examType: '',
    session: '',
    classId: '',
    section: '',
    subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const dispatch = useDispatch();
  const { examResult, fclass, sections, admissionForms, user } = useSelector((state: RootState) => state);
  const { examResultsList, loading: examLoading, error: examError } = examResult;
  const { fclassesList, loading: classLoading, error: classError } = fclass;
  const { sectionsList, loading: sectionLoading, error: sectionError } = sections;
  const { admissionForms: admissionFormsList, loading: admissionLoading, error: admissionError } = admissionForms;
  const adminID = user.currentUser?._id;

  // Dropdown options
  const examGroups = ["Class 4 (Pass / Fail)", "Class 5 (Pass / Fail)"];
  const examTypes = ["FINAL EXAM (March-2025)", "Mid-Term (Sept-2024)"];
  const sessions = ["2018-19", "2019-20"];
  const classOptions = fclassesList.map((cls) => ({ value: cls._id, label: cls.name }));
  const sectionOptions = fclassesList
    .find((cls) => cls._id === selectedClass)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const formSectionOptions = fclassesList
    .find((cls) => cls._id === formData.classId)
    ?.sections.map((sec) => ({ value: sec, label: sec })) || [];
  const admissionOptions = admissionFormsList
    .filter((form) => (!formData.classId || form.classId._id === formData.classId) && (!formData.section || form.section === formData.section))
    .map((form) => ({
      value: form.admissionNo,
      label: `${form.admissionNo} - ${form.firstName} ${form.lastName}`,
      data: form,
    }));
  const attendanceOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  // Fetch data on mount
  useEffect(() => {
    if (adminID) {
      dispatch(getAllExamResults(adminID));
      dispatch(getAllFclasses(adminID));
      dispatch(getAllSections(adminID));
      dispatch(fetchAdmissionForms(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view exam results', severity: 'error' });
    }
  }, [dispatch, adminID]);

  // Handle errors from Redux
  useEffect(() => {
    if (examError || classError || sectionError || admissionError) {
      setSnack({
        open: true,
        message: examError || classError || sectionError || admissionError || 'An error occurred',
        severity: 'error',
      });
      dispatch(clearExamResultError());
    }
  }, [examError, classError, sectionError, admissionError, dispatch]);

  // Debug class and section options
  useEffect(() => {
    console.log('fclassesList:', fclassesList);
    console.log('classOptions:', classOptions);
    console.log('formSectionOptions:', formSectionOptions);
    console.log('admissionOptions:', admissionOptions);
    console.log('examResultsList:', examResultsList);
  }, [fclassesList, classOptions, formSectionOptions, admissionOptions, examResultsList]);

  const handleSearch = () => {
    // Filtering is handled in filteredExamResults
  };

  const handleSort = (column: string) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedData = [...filteredExamResults].sort((a, b) => {
      let valueA = a[column as keyof ExamResult];
      let valueB = b[column as keyof ExamResult];

      if (['grandTotal', 'percent', 'rank', 'gpa'].includes(column)) {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      }

      if (valueA < valueB) return newSortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredExamResults(sortedData);
  };

  const handleAdd = () => {
    setFormData({
      admissionNo: '',
      rollNo: '',
      studentName: '',
      examGroup: '',
      examType: '',
      session: '',
      classId: '',
      section: '',
      subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
    setEditId(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditId(null);
    setFormData({
      admissionNo: '',
      rollNo: '',
      studentName: '',
      examGroup: '',
      examType: '',
      session: '',
      classId: '',
      section: '',
      subjects: [{ subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number | null = null, field: string | null = null) => {
    if (index !== null && field) {
      const newSubjects = [...formData.subjects];
      const marks = field === 'marksObtained' ? Number(e.target.value) : Number(newSubjects[index].marksObtained);
      const attendance = newSubjects[index].attendance;
      const effectiveMarks = attendance === 'Absent' ? 0 : marks;
      const { grade } = isNaN(effectiveMarks) || effectiveMarks < 0 || effectiveMarks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(effectiveMarks);
      newSubjects[index] = { ...newSubjects[index], [field]: e.target.value, grade: grade };
      setFormData({ ...formData, subjects: newSubjects });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (fieldName: string, newValue: any, index: number | null = null) => {
    if (index !== null && fieldName === 'attendance') {
      const newSubjects = [...formData.subjects];
      const marks = newSubjects[index].attendance === 'Absent' ? 0 : Number(newSubjects[index].marksObtained);
      const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
      newSubjects[index] = { ...newSubjects[index], attendance: newValue ? newValue.value : 'Present', grade: grade };
      setFormData({ ...formData, subjects: newSubjects });
    } else if (fieldName === 'admissionNo' && newValue) {
      const admission = admissionOptions.find((opt) => opt.value === newValue.value)?.data;
      if (admission) {
        setFormData({
          ...formData,
          admissionNo: admission.admissionNo,
          rollNo: admission.rollNo,
          studentName: `${admission.firstName} ${admission.lastName}`,
          classId: admission.classId._id,
          section: admission.section,
        });
      }
    } else if (fieldName === 'classId') {
      setFormData({
        ...formData,
        classId: newValue ? newValue.value : '',
        section: '',
        admissionNo: '',
        rollNo: '',
        studentName: '',
      });
    } else if (fieldName === 'section') {
      setFormData({
        ...formData,
        section: newValue ? newValue.value : '',
        admissionNo: '',
        rollNo: '',
        studentName: '',
      });
    } else {
      setFormData({ ...formData, [fieldName]: newValue ? newValue.value : '' });
    }
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subjectName: '', marksObtained: '', subjectCode: '', grade: '', attendance: 'Present' }],
    });
  };

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add exam results', severity: 'error' });
      return;
    }
    if (
      !formData.admissionNo ||
      !formData.rollNo ||
      !formData.studentName ||
      !formData.examGroup ||
      !formData.examType ||
      !formData.session ||
      !formData.classId ||
      !formData.section ||
      !formData.subjects.every((sub) => sub.subjectName && sub.marksObtained && sub.subjectCode && sub.attendance)
    ) {
      setSnack({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }

    const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(formData.subjects);

    const action = editId
      ? updateExamResult({ id: editId, examResult: { ...formData, grandTotal, percent, gpa, overallGrade }, adminID })
      : createExamResult({ ...formData, grandTotal, percent, gpa, overallGrade }, adminID);

    dispatch(action)
      .then(() => {
        setSnack({ open: true, message: editId ? 'Exam result updated successfully' : 'Exam result added successfully', severity: 'success' });
        handleClosePopup();
      })
      .catch((err) => {
        setSnack({ open: true, message: err.message || 'Failed to save exam result', severity: 'error' });
      });
  };

  const handleEdit = (result: ExamResult) => {
    // Calculate grades, grand total, and percent for subjects on edit
    const subjectsWithGrades = result.subjects.map((sub) => {
      const marks = sub.attendance === 'Absent' ? 0 : Number(sub.marksObtained);
      const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
      return { ...sub, grade };
    });
    const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(subjectsWithGrades);
    setFormData({
      admissionNo: result.admissionNo,
      rollNo: result.rollNo,
      studentName: result.studentName,
      examGroup: result.examGroup,
      examType: result.examType,
      session: result.session,
      classId: result.classId._id,
      section: result.section,
      subjects: subjectsWithGrades,
    });
    setEditId(result._id || null);
    setIsPopupOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete exam results', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this exam result?')) {
      dispatch(deleteExamResult(id, adminID))
        .then(() => {
          setSnack({ open: true, message: 'Exam result deleted successfully', severity: 'info' });
        })
        .catch((err) => {
          setSnack({ open: true, message: err.message || 'Failed to delete exam result', severity: 'error' });
        });
    }
  };

  const handleExport = () => {
    setSnack({ open: true, message: 'Exporting exam results as CSV', severity: 'info' });
  };

  const handlePrint = () => {
    window.print();
    setSnack({ open: true, message: 'Printing exam results', severity: 'info' });
  };

  const filteredExamResults = examResultsList.map((result) => {
    const subjectsWithGrades = result.subjects.map((sub) => {
      const marks = sub.attendance === 'Absent' ? 0 : Number(sub.marksObtained);
      const { grade } = isNaN(marks) || marks < 0 || marks > 100 ? { gpa: 0, grade: 'N/A' } : getGrade(marks);
      return { ...sub, grade };
    });
    const { gpa, overallGrade, grandTotal, percent } = calculateGPAandGrade(subjectsWithGrades);
    return { ...result, subjects: subjectsWithGrades, grandTotal, percent, gpa, overallGrade };
  }).filter((result) => {
    const groupMatch = !selectedExamGroup || result.examGroup === selectedExamGroup;
    const typeMatch = !selectedExamType || result.examType === selectedExamType;
    const sessionMatch = !selectedSession || result.session === selectedSession;
    const classMatch = !selectedClass || result.classId._id === selectedClass;
    const sectionMatch = !selectedSection || result.section === selectedSection;
    const searchMatch =
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return groupMatch && typeMatch && sessionMatch && classMatch && sectionMatch && searchMatch;
  });

  const csvData = filteredExamResults.map((result) => ({
    AdmissionNo: result.admissionNo,
    RollNumber: result.rollNo,
    StudentName: result.studentName,
    ...result.subjects.reduce(
      (acc, sub) => ({
        ...acc,
        [`${sub.subjectName} (Marks)`]: `${sub.attendance === 'Absent' ? 0 : sub.marksObtained || 0}/100`,
        [`${sub.subjectName} (Grade)`]: sub.grade || 'N/A',
        [`${sub.subjectName} (Attendance)`]: sub.attendance || 'Present',
      }),
      {}
    ),
    GrandTotal: `${result.grandTotal || 0}/${result.subjects.length * 100 || 0}`,
    Percent: (result.percent || 0).toFixed(2),
    GPA: (result.gpa || 0).toFixed(2),
    OverallGrade: result.overallGrade || 'N/A',
    Rank: result.rank || 0,
    Result: result.result || 'N/A',
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, color: '#333', mb: 4 }}>
        Exam Result Management
      </Typography>

      <Grid container spacing={2}>
        {/* Select Criteria */}
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 1, sm: 2 }, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                Select Criteria
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    options={examGroups.map((group) => ({ value: group, label: group }))}
                    value={examGroups.find((group) => group === selectedExamGroup) ? { value: selectedExamGroup, label: selectedExamGroup } : null}
                    onChange={(newValue) => setSelectedExamGroup(newValue ? newValue.value : '')}
                    placeholder="Select Exam Group"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    options={examTypes.map((type) => ({ value: type, label: type }))}
                    value={examTypes.find((type) => type === selectedExamType) ? { value: selectedExamType, label: selectedExamType } : null}
                    onChange={(newValue) => setSelectedExamType(newValue ? newValue.value : '')}
                    placeholder="Select Exam Type"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    options={sessions.map((session) => ({ value: session, label: session }))}
                    value={sessions.find((session) => session === selectedSession) ? { value: selectedSession, label: selectedSession } : null}
                    onChange={(newValue) => setSelectedSession(newValue ? newValue.value : '')}
                    placeholder="Select Session"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {classLoading ? (
                    <CircularProgress size={24} />
                  ) : fclassesList.length === 0 ? (
                    <Typography color="error">No classes available</Typography>
                  ) : (
                    <Select
                      options={classOptions}
                      value={classOptions.find((opt) => opt.value === selectedClass) || null}
                      onChange={(newValue) => {
                        setSelectedClass(newValue ? newValue.value : '');
                        setSelectedSection('');
                      }}
                      placeholder="Select Class"
                      isClearable
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    options={sectionOptions}
                    value={sectionOptions.find((opt) => opt.value === selectedSection) || null}
                    onChange={(newValue) => setSelectedSection(newValue ? newValue.value : '')}
                    placeholder="Select Section"
                    isClearable
                    isSearchable
                    isDisabled={!selectedClass}
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSearch}
                    fullWidth
                    sx={{ height: '40px' }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Exam Result List */}
        <Grid item xs={12}>
          <Card sx={{ p: { xs: 1, sm: 2 }, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: { xs: 2, sm: 0 } }}>
                  Exam Result List
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <CSVLink
                    data={csvData}
                    filename="exam-results.csv"
                    style={{ textDecoration: 'none' }}
                    onClick={handleExport}
                  >
                    <IconButton sx={{ color: '#666' }} title="Export">
                      <DownloadIcon />
                    </IconButton>
                  </CSVLink>
                  <IconButton sx={{ color: '#666' }} onClick={handlePrint} title="Print">
                    <PrintIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAdd}
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                  >
                    + Add Result
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                label="Search exam results"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer component={Paper} sx={{ boxShadow: 'none', overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#333' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }} onClick={() => handleSort('admissionNo')}>
                        Admission No {sortColumn === 'admissionNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }} onClick={() => handleSort('rollNo')}>
                        Roll Number {sortColumn === 'rollNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 150 }} onClick={() => handleSort('studentName')}>
                        Student Name {sortColumn === 'studentName' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      {filteredExamResults[0]?.subjects.map((sub) => (
                        <React.Fragment key={sub.subjectName}>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }}>
                            {sub.subjectName} (Marks)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }}>
                            {sub.subjectName} (Attendance)
                          </TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }}>
                            {sub.subjectName} (Grade)
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }} onClick={() => handleSort('grandTotal')}>
                        Grand Total {sortColumn === 'grandTotal' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }} onClick={() => handleSort('percent')}>
                        Percent (%) {sortColumn === 'percent' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 80 }} onClick={() => handleSort('gpa')}>
                        GPA {sortColumn === 'gpa' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }}>
                        Overall Grade
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 80 }} onClick={() => handleSort('rank')}>
                        Rank {sortColumn === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 100 }} onClick={() => handleSort('result')}>
                        Result {sortColumn === 'result' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600, minWidth: 120 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examLoading ? (
                      <TableRow>
                        <TableCell colSpan={13 + (filteredExamResults[0]?.subjects.length || 0) * 3} sx={{ textAlign: 'center' }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : filteredExamResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={13 + (filteredExamResults[0]?.subjects.length || 0) * 3} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          No exam results found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExamResults.map((result, idx) => (
                        <TableRow key={result._id} sx={{ bgcolor: idx % 2 ? '#fff' : '#f9f9f9', '&:hover': { bgcolor: '#e0f7fa' } }}>
                          <TableCell>{result.admissionNo}</TableCell>
                          <TableCell>{result.rollNo}</TableCell>
                          <TableCell>{result.studentName}</TableCell>
                          {result.subjects.map((sub) => (
                            <React.Fragment key={sub.subjectName}>
                              <TableCell>{`${sub.attendance === 'Absent' ? 0 : sub.marksObtained || 0}/100`}</TableCell>
                              <TableCell>{sub.attendance || 'Present'}</TableCell>
                              <TableCell>{sub.grade || 'N/A'}</TableCell>
                            </React.Fragment>
                          ))}
                          <TableCell>{`${result.grandTotal || 0}/${result.subjects.length * 100}`}</TableCell>
                          <TableCell>{(result.percent || 0).toFixed(2)}%</TableCell>
                          <TableCell>{(result.gpa || 0).toFixed(2)}</TableCell>
                          <TableCell>{result.overallGrade || 'N/A'}</TableCell>
                          <TableCell>{result.rank || 0}</TableCell>
                          <TableCell>{result.result || 'N/A'}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(result)} sx={{ color: '#1976d2' }} title="Edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(result._id || '')} sx={{ color: '#d32f2f' }} title="Delete">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#333' }}>
                Records: {filteredExamResults.length} of {examResultsList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { width: { xs: '90%', sm: '80%', md: '70%' } } }}>
        <DialogTitle>{editId ? 'Edit Exam Result' : 'Add Exam Result'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              {classLoading ? (
                <CircularProgress size={24} />
              ) : fclassesList.length === 0 ? (
                <Typography color="error">No classes available. Please add classes first.</Typography>
              ) : (
                <Select
                  options={classOptions}
                  value={classOptions.find((opt) => opt.value === formData.classId) || null}
                  onChange={(newValue) => handleSelectChange('classId', newValue)}
                  placeholder="Select Class"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {formSectionOptions.length === 0 && formData.classId ? (
                <Typography color="error">No sections available for this class</Typography>
              ) : (
                <Select
                  options={formSectionOptions}
                  value={formSectionOptions.find((opt) => opt.value === formData.section) || null}
                  onChange={(newValue) => handleSelectChange('section', newValue)}
                  placeholder="Select Section"
                  isClearable
                  isSearchable
                  isDisabled={!formData.classId}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {admissionLoading ? (
                <CircularProgress size={24} />
              ) : admissionOptions.length === 0 && formData.classId && formData.section ? (
                <Typography color="error">No students found for this class and section</Typography>
              ) : (
                <Select
                  options={admissionOptions}
                  value={admissionOptions.find((opt) => opt.value === formData.admissionNo) || null}
                  onChange={(newValue) => handleSelectChange('admissionNo', newValue)}
                  placeholder="Select Admission No"
                  isClearable
                  isSearchable
                  isDisabled={!formData.classId || !formData.section}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                options={examGroups.map((group) => ({ value: group, label: group }))}
                value={examGroups.find((group) => group === formData.examGroup) ? { value: formData.examGroup, label: formData.examGroup } : null}
                onChange={(newValue) => handleSelectChange('examGroup', newValue)}
                placeholder="Select Exam Group"
                isClearable
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                options={examTypes.map((type) => ({ value: type, label: type }))}
                value={examTypes.find((type) => type === formData.examType) ? { value: formData.examType, label: formData.examType } : null}
                onChange={(newValue) => handleSelectChange('examType', newValue)}
                placeholder="Select Exam Type"
                isClearable
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                options={sessions.map((session) => ({ value: session, label: session }))}
                value={sessions.find((session) => session === formData.session) ? { value: formData.session, label: formData.session } : null}
                onChange={(newValue) => handleSelectChange('session', newValue)}
                placeholder="Select Session"
                isClearable
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Subjects (Marks should be between 0 and 100)
              </Typography>
              {formData.subjects.map((subject, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Subject Name"
                      value={subject.subjectName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'subjectName')}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Marks Obtained (0-100)"
                      type="number"
                      value={subject.attendance === 'Absent' ? 0 : subject.marksObtained}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = Number(e.target.value);
                        if (value > 100 || value < 0) {
                          setSnack({ open: true, message: 'Marks must be between 0 and 100', severity: 'warning' });
                          return;
                        }
                        handleInputChange(e, index, 'marksObtained');
                      }}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 100 }}
                      error={Number(subject.marksObtained) > 100 || Number(subject.marksObtained) < 0}
                      helperText={Number(subject.marksObtained) > 100 || Number(subject.marksObtained) < 0 ? 'Invalid marks' : ''}
                      disabled={subject.attendance === 'Absent'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Subject Code"
                      value={subject.subjectCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'subjectCode')}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Select
                      options={attendanceOptions}
                      value={attendanceOptions.find((opt) => opt.value === subject.attendance) || null}
                      onChange={(newValue) => handleSelectChange('attendance', newValue, index)}
                      placeholder="Attendance"
                      isClearable
                      isSearchable
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Grade"
                      value={subject.grade || 'N/A'}
                      disabled
                      variant="outlined"
                      size="small"
                    />
                    {index > 0 && (
                      <IconButton onClick={() => removeSubject(index)} color="error">
                        <FaMinus />
                      </IconButton>
                    )}
                    {index === formData.subjects.length - 1 && (
                      <IconButton onClick={addSubject} color="success">
                        <FaPlus />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Grand Total: {calculateGPAandGrade(formData.subjects).grandTotal}/{formData.subjects.length * 100}
              </Typography>
              <Typography>
                Percentage: {calculateGPAandGrade(formData.subjects).percent}%
              </Typography>
              <Typography>
                GPA: {(calculateGPAandGrade(formData.subjects).gpa).toFixed(2)}
              </Typography>
              <Typography>
                Overall Grade: {calculateGPAandGrade(formData.subjects).overallGrade}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="success">
            {editId ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamResult;
