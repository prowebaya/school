import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchAllHouses,
  createHouse,
  deleteHouse,
} from '../../redux/StudentAddmissionDetail/houseHandle';
import {
  setNewHouse,
  setSearch,
  resetHouse,
} from '../../redux/StudentAddmissionDetail/houseSlice';
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
import { Edit, Delete, FileCopy, Print, PictureAsPdf, Search } from '@mui/icons-material';

const HouseStudent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { houses = [], newHouse, search = '', loading, error } = useSelector(
    (state: RootState) => state.house
  );
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(fetchAllHouses(adminID));
    } else {
      toast.error('Please log in to manage houses', { position: 'top-right', autoClose: 3000 });
    }

    return () => {
      dispatch(resetHouse());
    };
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const addHouse = () => {
    if (!newHouse.name?.trim()) {
      toast.warn('House name cannot be empty!', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (
      houses.some(
        (house) => house?.name?.toLowerCase() === newHouse.name.trim().toLowerCase()
      )
    ) {
      toast.warn('House already exists!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    const housePayload = {
      name: newHouse.name.trim(),
      description: newHouse.description || '',
      class: newHouse.class || '',
    };

    dispatch(createHouse({ adminID, house: housePayload }))
      .then((result) => {
        // Use unwrap to get the fulfilled or rejected value
        return result.unwrap();
      })
      .then(() => {
        toast.success('House added successfully', { position: 'top-right', autoClose: 3000 });
        dispatch(setNewHouse({ name: '', description: '', class: '' }));
      })
      .catch((err) => {
        toast.error(`Failed to add house: ${err.message || err}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  const handleDeleteHouse = (houseId: string) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      dispatch(deleteHouse({ adminID, houseId }))
        .then((result) => {
          return result.unwrap();
        })
        .then(() => {
          toast.success('House deleted successfully', { position: 'top-right', autoClose: 3000 });
        })
        .catch((err) => {
          toast.error(`Failed to delete house: ${err.message || err}`, {
            position: 'top-right',
            autoClose: 3000,
          });
        });
    }
  };

  const filteredHouses = (houses || []).filter((house) => {
    if (!house || !house.name) {
      console.warn('Invalid house data:', house);
      return false;
    }
    return house.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={styles.container}>
        <ToastContainer />
        {/* Left Form */}
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>
              Add School House
            </Typography>
            <TextField
              label="Name"
              variant="outlined"
              required
              fullWidth
              style={styles.input}
              value={newHouse.name || ''}
              onChange={(e) =>
                dispatch(setNewHouse({ ...newHouse, name: e.target.value }))
              }
            />
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={2}
              fullWidth
              style={styles.input}
              value={newHouse.description || ''}
              onChange={(e) =>
                dispatch(setNewHouse({ ...newHouse, description: e.target.value }))
              }
            />
            <TextField
              label="Class"
              variant="outlined"
              fullWidth
              style={styles.input}
              value={newHouse.class || ''}
              onChange={(e) =>
                dispatch(setNewHouse({ ...newHouse, class: e.target.value }))
              }
            />
            <Button
              variant="contained"
              style={styles.button}
              onClick={addHouse}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </CardContent>
        </Card>

        {/* Right Table */}
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h5" style={styles.title}>
              Student House List
            </Typography>
            <div style={styles.searchContainer}>
              <Search style={{ marginRight: '8px', color: '#777' }} />
              <TextField
                label="Search by Name"
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </div>
            <div style={styles.dividerButtons}>
              <IconButton color="primary">
                <FileCopy />
              </IconButton>
              <IconButton color="secondary">
                <Print />
              </IconButton>
              <IconButton color="error">
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
                    <TableCell style={styles.tableHeaderCell}>Name</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Description</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Class</TableCell>
                    <TableCell style={styles.tableHeaderCell}>House ID</TableCell>
                    <TableCell style={styles.tableHeaderCell}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHouses.length > 0 ? (
                    filteredHouses.map((house) => (
                      <TableRow key={house._id} style={styles.tableRow}>
                        <TableCell>{house.name}</TableCell>
                        <TableCell>{house.description || '-'}</TableCell>
                        <TableCell>{house.class || '-'}</TableCell>
                        <TableCell>{house.id || '-'}</TableCell>
                        <TableCell>
                          <IconButton color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteHouse(house._id)}
                            disabled={loading}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        style={{ textAlign: 'center', color: '#999' }}
                      >
                        No houses found.
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
    flexWrap: 'wrap' as const,
  },
  card: {
    flex: 1,
    minWidth: '320px',
    maxWidth: '500px',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#e8c897',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center' as const,
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
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  dividerButtons: {
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

export default HouseStudent;