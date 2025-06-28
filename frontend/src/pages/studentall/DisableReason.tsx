import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  fetchAllReasons,
  createReason,
  updateReason,
  deleteReason,
} from '../../redux/StudentAddmissionDetail/reasonHandle';
import {
  setNewReason,
  setEditReason,
  toggleEditReason,
  resetReason,
} from '../../redux/StudentAddmissionDetail/reasonSlice';
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
import { Edit, Delete, FileCopy, Print, PictureAsPdf } from '@mui/icons-material';

const DisableReason: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reasons, newReason, loading, error, status } = useSelector(
    (state: RootState) => state.reason
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllReasons(adminID));
    } else {
      toast.error('Please log in to manage reasons', { position: 'top-right', autoClose: 3000 });
    }

    return () => {
      dispatch(resetReason());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const addReason = () => {
    if (!newReason.trim()) {
      toast.warn('Reason cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (reasons.some((reason) => reason.text.toLowerCase() === newReason.trim().toLowerCase())) {
      toast.warn('Reason already exists!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    dispatch(createReason(adminID, newReason.trim())).then(() => {
      toast.success('Reason added successfully', { position: 'top-right', autoClose: 3000 });
    });
  };

  const handleEdit = (id: string) => {
    dispatch(toggleEditReason(id));
  };

  const handleTextChange = (id: string, text: string) => {
    dispatch(setEditReason({ id, text }));
  };

  const handleSave = (id: string) => {
    const reason = reasons.find((r) => r._id === id);
    if (!reason?.text.trim()) {
      toast.warn('Reason cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(updateReason(adminID, id, reason.text)).then(() => {
      toast.success('Reason updated successfully', { position: 'top-right', autoClose: 3000 });
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reason?')) {
      dispatch(deleteReason(adminID, id)).then(() => {
        toast.success('Reason deleted successfully', { position: 'top-right', autoClose: 3000 });
      });
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Disable Reason List', 10, 10);
    doc.autoTable({
      head: [['Disable Reason']],
      body: reasons.map((r) => [r.text]),
    });
    doc.save('DisableReasonList.pdf');
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
              Add Disable Reason
            </Typography>
            <TextField
              label="Reason"
              variant="outlined"
              required
              fullWidth
              style={styles.input}
              value={newReason}
              onChange={(e) => dispatch(setNewReason(e.target.value))}
            />
            <Button
              variant="contained"
              style={styles.button}
              onClick={addReason}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>
              Disable Reason List
            </Typography>
            <div style={styles.exportButtons}>
              <IconButton color="primary" onClick={() => navigator.clipboard.writeText(JSON.stringify(reasons))}>
                <FileCopy />
              </IconButton>
              <IconButton color="secondary" onClick={() => window.print()}>
                <Print />
              </IconButton>
              <IconButton color="error" onClick={exportPDF}>
                <PictureAsPdf />
              </IconButton>
            </div>
            {loading && (
              <div style={{ textAlign: 'center', color: '#34495e' }}>Loading...</div>
            )}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={styles.tableHeader}>
                    <TableCell style={styles.tableHeaderCell}>Disable Reason</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Reason ID</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reasons.length > 0 ? (
                    reasons.map((reason) => (
                      <TableRow key={reason._id} style={styles.tableRow}>
                        <TableCell>
                          {reason.isEditing ? (
                            <TextField
                              value={reason.text}
                              onChange={(e) => handleTextChange(reason._id, e.target.value)}
                              fullWidth
                            />
                          ) : (
                            reason.text
                          )}
                        </TableCell>
                        <TableCell>{reason.id}</TableCell>
                        <TableCell>
                          {reason.isEditing ? (
                            <IconButton color="primary" onClick={() => handleSave(reason._id)}>
                              <Typography>✔️</Typography>
                            </IconButton>
                          ) : (
                            <IconButton color="primary" onClick={() => handleEdit(reason._id)}>
                              <Edit />
                            </IconButton>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(reason._id)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: 'center', color: '#999' }}>
                        No reasons found.
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
  input: {
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
  },
  exportButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    justifyContent: 'flex-end',
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

export default DisableReason;
