import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { fetchClasses, searchStudents, clearSearchError } from '../../redux/StudentAddmissionDetail/searchStudentHandle';

const StudentDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const searchState = useSelector((state) => state.searchStudent || {});
  const userState = useSelector((state) => state.user || {});
  const { classes, searchResults, loading, error } = searchState;
  const adminID = userState.currentUser?._id;

  const [classId, setClassId] = useState('');
  const [section, setSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (adminID) {
      dispatch(fetchClasses(adminID));
    }
    if (adminID && id) {
      setSearchQuery(id);
      dispatch(searchStudents({ rollNo: id, adminID }));
    }
    return () => {
      dispatch(clearSearchError());
    };
  }, [dispatch, adminID, id]);

  const handleSearch = () => {
    if (adminID) {
      dispatch(searchStudents({
        rollNo: searchQuery,
        admissionNo: searchQuery,
        classId,
        section,
        adminID,
      }));
    }
  };

  return (
    <Box sx={{ background: '#e8c897', minHeight: '100vh', padding: '40px 0' }}>
      <Box sx={{ maxWidth: '600px', margin: 'auto', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          📄 Student Search
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              label="Class"
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>{cls.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Section</InputLabel>
            <Select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              label="Section"
            >
              <MenuItem value="">Select Section</MenuItem>
              {classId && classes.find((cls) => cls._id === classId)?.sections?.map((sec) => (
                <MenuItem key={sec} value={sec}>{sec}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Roll No or Admission No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ background: '#007bff' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" align="center" sx={{ marginBottom: '20px' }}>
            🚫 {error}
          </Typography>
        )}

        {searchResults.length > 0 ? (
          searchResults.map((student) => (
            <Box key={student._id} sx={{ marginBottom: '20px' }}>
              <Typography><strong>Admission No:</strong> {student.admissionNo}</Typography>
              <Typography><strong>Name:</strong> {student.firstName} {student.lastName}</Typography>
              <Typography><strong>Roll No:</strong> {student.rollNo}</Typography>
              <Typography><strong>Class:</strong> {student.class?.name || 'N/A'}</Typography>
              <Typography><strong>Section:</strong> {student.section || 'N/A'}</Typography>
              <Typography><strong>Father's Name:</strong> {student.parents?.father?.name || 'N/A'}</Typography>
              <Typography><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</Typography>
              <Typography><strong>Gender:</strong> {student.gender}</Typography>
              <Typography><strong>Mobile No:</strong> {student.parents?.father?.phone || 'N/A'}</Typography>
            </Box>
          ))
        ) : !loading && !error ? (
          <Typography color="error" align="center">
            🚫 No students found.
          </Typography>
        ) : null}

        <Link to="/Admin/students" style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            sx={{ marginTop: '20px', width: '100%' }}
          >
            🔙 Back to Students
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default StudentDetailPage;