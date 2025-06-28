import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select, { OnChangeValue } from 'react-select';
import {
  fetchAllDisabledStudents,
  createDisabledStudent,
  updateDisabledStudent,
  deleteDisabledStudent,
} from '../../redux/StudentAddmissionDetail/disabledStudentHandle';
import {
  setNewDisabledStudent,
  toggleEditDisabledStudent,
  setEditDisabledStudent,
  resetDisabledStudent,
} from '../../redux/StudentAddmissionDetail/disabledStudentSlice';
import { fetchAllReasons } from '../../redux/StudentAddmissionDetail/reasonHandle';
import { fetchAdmissionForms } from '../../redux/StudentAddmissionDetail/studentAddmissionHandle';
import { RootState, AppDispatch } from '../../redux/store';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface Option {
  value: string;
  label: string;
}

interface DisabledStudent {
  _id: string;
  reasonId: string;
  studentId: string;
  reasonText?: string;
  studentName?: string;
  studentClass?: string;
  studentAdmissionNo?: string;
  isEditing?: boolean;
}

const DisableStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reasons } = useSelector((state: RootState) => state.reason);
  const { admissionForms } = useSelector((state: RootState) => state.admissionForms);
  const { disabledStudents, newDisabledStudent, loading, error, status } = useSelector(
    (state: RootState) => state.disabledStudent
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllReasons(adminID));
      dispatch(fetchAdmissionForms(adminID));
      dispatch(fetchAllDisabledStudents(adminID));
    } else {
      toast.error('Please log in to manage disabled students', { position: 'top-right', autoClose: 3000 });
    }

    return () => {
      dispatch(resetDisabledStudent());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const reasonOptions: Option[] = reasons.map((reason) => ({
    value: reason._id,
    label: reason.text,
  }));

  const studentOptions: Option[] = admissionForms.map((form) => ({
    value: form._id,
    label: `${form.firstName} ${form.lastName} (Class: ${
      typeof form.classId === 'object' ? form.classId?.name : form.classId
    }, Admission No: ${form.admissionNo})`,
  }));

  const handleReasonChange = (newValue: OnChangeValue<Option, false>) => {
    dispatch(setNewDisabledStudent({ ...newDisabledStudent, reasonId: newValue ? newValue.value : '' }));
  };

  const handleStudentChange = (newValue: OnChangeValue<Option, false>) => {
    dispatch(setNewDisabledStudent({ ...newDisabledStudent, studentId: newValue ? newValue.value : '' }));
  };

  const addDisabledStudent = () => {
    if (!newDisabledStudent.reasonId || !newDisabledStudent.studentId) {
      toast.warn('Please select both a reason and a student!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (
      disabledStudents.some(
        (ds) => ds.studentId === newDisabledStudent.studentId && ds.reasonId === newDisabledStudent.reasonId
      )
    ) {
      toast.warn('This student is already disabled for this reason!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(createDisabledStudent(adminID, newDisabledStudent)).then(() => {
      toast.success('Student disabled successfully', { position: 'top-right', autoClose: 3000 });
      dispatch(setNewDisabledStudent({ reasonId: '', studentId: '' }));
    });
  };

  const handleEdit = (id: string) => {
    dispatch(toggleEditDisabledStudent(id));
  };

  const handleEditReasonChange = (id: string, newValue: OnChangeValue<Option, false>) => {
    dispatch(setEditDisabledStudent({ id, reasonId: newValue ? newValue.value : '' }));
  };

  const handleEditStudentChange = (id: string, newValue: OnChangeValue<Option, false>) => {
    dispatch(setEditDisabledStudent({ id, studentId: newValue ? newValue.value : '' }));
  };

  const handleSave = (id: string) => {
    const disabledStudent = disabledStudents.find((ds) => ds._id === id);
    if (!disabledStudent?.reasonId || !disabledStudent?.studentId) {
      toast.warn('Please select both a reason and a student!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(
      updateDisabledStudent(adminID, id, {
        reasonId: disabledStudent.reasonId,
        studentId: disabledStudent.studentId,
      })
    ).then(() => {
      toast.success('Disabled student updated successfully', { position: 'top-right', autoClose: 3000 });
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this disabled student?')) {
      dispatch(deleteDisabledStudent(adminID, id)).then(() => {
        toast.success('Disabled student removed successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <ToastContainer />
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>
              Disable Student
            </Typography>
            <Select
              options={reasonOptions}
              value={reasonOptions.find((opt) => opt.value === newDisabledStudent.reasonId) || null}
              onChange={handleReasonChange}
              placeholder="Select Disable Reason"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={studentOptions}
              value={studentOptions.find((opt) => opt.value === newDisabledStudent.studentId) || null}
              onChange={handleStudentChange}
              placeholder="Select Student (Name, Class, Admission No)"
              isClearable
              styles={selectStyles}
            />
            <Button
              variant="contained"
              style={styles.button}
              onClick={addDisabledStudent}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Done'}
            </Button>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>
              Disabled Students List
            </Typography>
            {loading && (
              <div style={{ textAlign: 'center', color: '#34495e' }}>Loading...</div>
            )}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={styles.tableHeader}>
                    <TableCell style={styles.tableHeaderCell}>Disable Reason</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Student Name</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Class</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Admission No</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {disabledStudents.length > 0 ? (
                    disabledStudents.map((ds) => (
                      <TableRow key={ds._id} style={styles.tableRow}>
                        <TableCell>
                          {ds.isEditing ? (
                            <Select
                              options={reasonOptions}
                              value={reasonOptions.find((opt) => opt.value === ds.reasonId) || null}
                              onChange={(newValue) => handleEditReasonChange(ds._id, newValue)}
                              placeholder="Select Disable Reason"
                              styles={selectStyles}
                            />
                          ) : (
                            ds.reasonText
                          )}
                        </TableCell>
                        <TableCell>
                          {ds.isEditing ? (
                            <Select
                              options={studentOptions}
                              value={studentOptions.find((opt) => opt.value === ds.studentId) || null}
                              onChange={(newValue) => handleEditStudentChange(ds._id, newValue)}
                              placeholder="Select Student"
                              styles={selectStyles}
                            />
                          ) : (
                            ds.studentName
                          )}
                        </TableCell>
                        <TableCell>{ds.studentClass}</TableCell>
                        <TableCell>{ds.studentAdmissionNo}</TableCell>
                        <TableCell>
                          {ds.isEditing ? (
                            <IconButton color="primary" onClick={() => handleSave(ds._id)}>
                              <Typography>✔️</Typography>
                            </IconButton>
                          ) : (
                            <IconButton color="primary" onClick={() => handleEdit(ds._id)}>
                              <Edit />
                            </IconButton>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(ds._id)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                        No disabled students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#e8c897',
  },
  card: {
    flex: 1,
    minWidth: '320px',
    maxWidth: '500px',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444',
    marginBottom: '10px',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#e3f2fd',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    transition: 'background 0.3s',
  },
};

const selectStyles = {
  control: (base: any) => ({
    ...base,
    marginBottom: '10px',
    borderRadius: '6px',
    padding: '0.2rem',
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '6px',
    marginTop: '4px',
    zIndex: 1000,
  }),
};

export default DisableStudents;
