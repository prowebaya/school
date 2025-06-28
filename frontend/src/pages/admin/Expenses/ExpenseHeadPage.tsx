import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Grid, Snackbar, Alert, IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon, Save as SaveIcon, Undo as UndoIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllExpenseHeads, createExpenseHead, updateExpenseHead, deleteExpenseHead, clearExpenseHeadError,
} from '../../../redux/expenseRelated/expenseHeadHandle';
import styled from 'styled-components';

// Styled Components (adapted for Material-UI integration)
const ListItem = styled.div`
  display: grid;
  grid-template-columns: ${props => props.editing ? '1fr 1fr auto auto' : '1fr 2fr auto auto'};
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s ease;
  gap: 10px;

  &:hover {
    background: #f9f9f9;
  }

  input {
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
  }

  svg {
    margin-left: 10px;
    cursor: pointer;
    color: #666;
    transition: color 0.2s ease;
    
    &:hover {
      color: #333;
    }
  }
`;

const StatusIndicator = styled.span`
  color: ${props => props.active ? '#4CAF50' : '#f44336'};
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const ExpenseHeadPage = () => {
  const [newHead, setNewHead] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expenseHeadsList, loading, error } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenseHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view expense heads', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseHeadError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to add expense heads', severity: 'error' });
      return;
    }
    if (!newHead.trim() || !newDescription.trim()) {
      setSnack({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }
    dispatch(createExpenseHead({ name: newHead, description: newDescription }, adminID))
      .then(() => {
        setNewHead('');
        setNewDescription('');
        setSnack({ open: true, message: 'Expense head added successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to add expense head', severity: 'error' });
      });
  };

  const toggleStatus = (id, active) => {
    dispatch(updateExpenseHead({ id, expenseHead: { active: !active }, adminID }))
      .then(() => {
        setSnack({ open: true, message: 'Status updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update status', severity: 'error' });
      });
  };

  const deleteHead = (id) => {
    if (!adminID) {
      setSnack({ open: true, message: 'Please log in to delete expense heads', severity: 'error' });
      return;
    }
    dispatch(deleteExpenseHead(id, adminID))
      .then(() => {
        setSnack({ open: true, message: 'Expense head deleted', severity: 'info' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to delete expense head', severity: 'error' });
      });
  };

  const startEditing = (head) => {
    setEditingId(head._id);
    setEditName(head.name);
    setEditDescription(head.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = () => {
    if (!editName.trim() || !editDescription.trim()) {
      setSnack({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }
    dispatch(updateExpenseHead({ id: editingId, expenseHead: { name: editName, description: editDescription }, adminID }))
      .then(() => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
        setSnack({ open: true, message: 'Expense head updated successfully', severity: 'success' });
      })
      .catch(() => {
        setSnack({ open: true, message: 'Failed to update expense head', severity: 'error' });
      });
  };

  const filteredHeads = expenseHeadsList.filter((head) =>
    head.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    head.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1a2526',
          mb: 4,
          fontSize: { xs: '1.5rem', md: '2.125rem' },
        }}
      >
        Expense Head Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Add Expense Head
              </Typography>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', marginBottom: '20px' }}>
                <TextField
                  label="Expense Head"
                  value={newHead}
                  onChange={(e) => setNewHead(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                />
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Expense Head List
              </Typography>
              <TextField
                fullWidth
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              {loading ? (
                <Typography textAlign="center">Loading...</Typography>
              ) : filteredHeads.length === 0 ? (
                <Typography textAlign="center">No expense heads found</Typography>
              ) : (
                filteredHeads.map((head) => (
                  <ListItem key={head._id} editing={editingId === head._id}>
                    {editingId === head._id ? (
                      <>
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                        <TextField
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      </>
                    ) : (
                      <>
                        <div>{head.name}</div>
                        <div>{head.description}</div>
                      </>
                    )}
                    <StatusIndicator active={head.active} onClick={() => toggleStatus(head._id, head.active)}>
                      {head.active ? <CheckIcon /> : <CloseIcon />}
                      {head.active ? 'Active' : 'Inactive'}
                    </StatusIndicator>
                    <ActionContainer>
                      {editingId === head._id ? (
                        <>
                          <IconButton onClick={saveEdit} sx={{ color: '#4CAF50' }}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={cancelEditing} sx={{ color: '#f44336' }}>
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => startEditing(head)} sx={{ color: '#1976d2' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => deleteHead(head._id)} sx={{ color: '#d32f2f' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </ActionContainer>
                  </ListItem>
                ))
              )}
              <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                Showing {filteredHeads.length} of {expenseHeadsList.length} records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpenseHeadPage;