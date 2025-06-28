import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchIncomeHeads,
  addIncomeHead,
  updateIncomeHead,
  deleteIncomeHead,
  clearError,
} from '../../../redux/IncomeRelated/IncomeActions';

interface IncomeHead {
  _id: string;
  name: string;
  description: string;
}

interface RootState {
  income: {
    incomeHeads: IncomeHead[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const IncomeHeadPage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { incomeHeads, loading, error } = useSelector((state: RootState) => state.income || {});
  const adminID = currentUser?._id;

  const [searchTerm, setSearchTerm] = useState('');
  const [newHead, setNewHead] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchIncomeHeads(adminID));
    } else {
      toast.error('Please log in to view income heads', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [adminID, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => dispatch(clearError()),
      });
    }
  }, [error, dispatch]);

  const filteredHeads = incomeHeads.filter(head =>
    head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    head.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHead.trim() || !newDescription.trim()) {
      toast.error('Income head and description are required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const headData = { name: newHead, description: newDescription };

    try {
      if (editingId) {
        await dispatch(updateIncomeHead({ id: editingId, headData, adminID })).unwrap();
        toast.warn('Income head updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await dispatch(addIncomeHead({ headData, adminID })).unwrap();
        toast.success('Income head added successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setNewHead('');
      setNewDescription('');
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save income head', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteIncomeHead({ id, adminID })).unwrap();
      toast.error('Income head deleted successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete income head', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (head: IncomeHead) => {
    setNewHead(head.name);
    setNewDescription(head.description);
    setEditingId(head._id);
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#e8c897',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginBottom: '10px',
      fontSize: '14px',
    },
    button: {
      backgroundColor: editingId ? '#ffc107' : '#28a745',
      color: editingId ? '#212529' : 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    searchContainer: {
      marginBottom: '20px',
    },
    searchInput: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
    table: {
      background: '#fff',
      borderRadius: '5px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      padding: '10px',
    },
    tableHeader: {
      display: 'flex',
      backgroundColor: '#f8f9fa',
      padding: '10px',
      fontWeight: 'bold',
      borderBottom: '1px solid #ddd',
    },
    tableRow: {
      display: 'flex',
      padding: '10px',
      borderBottom: '1px solid #ddd',
      alignItems: 'center',
    },
    headerCell: {
      flex: 1,
      padding: '0 10px',
    },
    cell: {
      flex: 1,
      padding: '0 10px',
    },
    actionButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
      fontSize: '14px',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
    },
    recordCount: {
      marginTop: '10px',
      color: '#666',
      textAlign: 'right',
      fontSize: '14px',
    },
    loading: {
      textAlign: 'center',
      color: '#333',
      fontSize: '16px',
      margin: '20px 0',
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Income Head *</label>
          <input
            type="text"
            value={newHead}
            onChange={(e) => setNewHead(e.target.value)}
            style={styles.input}
            placeholder="Income Head"
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description *</label>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={styles.input}
            placeholder="Description"
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          {editingId ? 'Update Income Head' : 'Add Income Head'}
        </button>
      </form>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading && <div style={styles.loading}>Loading...</div>}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div style={styles.headerCell}>Income Head</div>
          <div style={styles.headerCell}>Description</div>
          <div style={styles.headerCell}>Action</div>
        </div>
        {filteredHeads.map(head => (
          <div key={head._id} style={styles.tableRow}>
            <div style={styles.cell}>{head.name}</div>
            <div style={styles.cell}>{head.description}</div>
            <div style={styles.cell}>
              <button onClick={() => handleEdit(head)} style={styles.actionButton}>
                Edit
              </button>
              <button onClick={() => handleDelete(head._id)} style={{ ...styles.actionButton, ...styles.deleteButton }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.recordCount}>
        Records: 1 to {filteredHeads.length} of {filteredHeads.length}
      </div>
      <style jsx>{`
        .Toastify__toast--success {
          background: linear-gradient(135deg, #28a745, #218838);
          color: #fff;
          font-family: Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 1rem;
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: #fff;
          font-family: Arial, sans-serif;
          borderRadius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 1rem;
        }
        .Toastify__toast--warning {
          background: linear-gradient(135deg, #ffc107, #e0a800);
          color: #212529;
          font-family: Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 1rem;
        }
        .Toastify__toast-body {
          padding: 10px;
        }
        .Toastify__close-button {
          color: #fff;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        .Toastify__close-button:hover {
          opacity: 1;
        }
        .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3);
        }
        .Toastify__toast--warning .Toastify__close-button {
          color: #212529;
        }
        .Toastify__toast--warning .Toastify__progress-bar {
          background: rgba(0, 0, 0, 0.3);
        }
        .tableRow:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default IncomeHeadPage;