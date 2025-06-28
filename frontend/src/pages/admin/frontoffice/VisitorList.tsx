import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchVisitors,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  clearError,
} from '../../../redux/FrontOffice/Enquiry/VisitorActions';

interface Visitor {
  _id: string;
  visitorName: string;
  meetingWith: string;
  purpose: string;
  phone: string;
  idCard: string;
  numOfPerson: number;
  date: string;
  inTime: string;
  outTime: string;
}

interface RootState {
  visitor: {
    visitors: Visitor[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const VisitorList: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { visitors, loading, error } = useSelector((state: RootState) => state.visitor || {});
  const adminID = currentUser?._id;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [newVisitor, setNewVisitor] = useState<Visitor | null>(null);

  // Refs for input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchVisitors(adminID));
    } else {
      toast.error('Please log in to view visitors', {
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

  const validateVisitor = (visitor: Visitor | null): string | null => {
    if (!visitor) return 'No visitor data';
    if (!visitor.visitorName.trim()) return 'Visitor name is required';
    if (!visitor.meetingWith.trim()) return 'Meeting with is required';
    if (!visitor.purpose.trim()) return 'Purpose is required';
    if (!visitor.phone.trim()) return 'Phone number is required';
    if (!visitor.idCard.trim()) return 'ID card number is required';
    if (visitor.numOfPerson < 1) return 'Number of persons must be at least 1';
    if (!visitor.date) return 'Date is required';
    if (!visitor.inTime) return 'In time is required';
    if (!visitor.outTime) return 'Out time is required';
    return null;
  };

  const deleteVisitorHandler = (id: string) => {
    dispatch(deleteVisitor(id, adminID));
    toast.error('Visitor deleted successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const viewVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setEditingVisitor(null);
    setNewVisitor(null);
  };

  const editVisitor = (visitor: Visitor) => {
    setEditingVisitor({ ...visitor });
    setSelectedVisitor(null);
    setNewVisitor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingVisitor) {
      setEditingVisitor((prev) => ({
        ...prev!,
        [name]: name === 'numOfPerson' ? parseInt(value) || 1 : value,
      }));
    } else if (newVisitor) {
      setNewVisitor((prev) => ({
        ...prev!,
        [name]: name === 'numOfPerson' ? parseInt(value) || 1 : value,
      }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isEditForm: boolean
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fields = [
        'visitorName',
        'meetingWith',
        'purpose',
        'phone',
        'idCard',
        'numOfPerson',
        'date',
        'inTime',
        'outTime',
      ];
      if (index < fields.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        // On last field, submit the form
        if (isEditForm) {
          saveEditedVisitor();
        } else {
          saveNewVisitor();
        }
      }
    }
  };

  const saveEditedVisitor = () => {
    const validationError = validateVisitor(editingVisitor);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    dispatch(updateVisitor(editingVisitor!._id, editingVisitor!, adminID));
    toast.warn('Visitor updated successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
    setEditingVisitor(null);
  };

  const addNewVisitor = () => {
    setNewVisitor({
      _id: '',
      visitorName: '',
      meetingWith: '',
      purpose: '',
      phone: '',
      idCard: '',
      numOfPerson: 1,
      date: '',
      inTime: '',
      outTime: '',
    });
    setEditingVisitor(null);
    setSelectedVisitor(null);
  };

  const saveNewVisitor = () => {
    const validationError = validateVisitor(newVisitor);
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    dispatch(addVisitor(newVisitor!, adminID));
    toast.success('Visitor added successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
    setNewVisitor(null);
  };

  const cancelEdit = () => setEditingVisitor(null);
  const cancelNewVisitor = () => setNewVisitor(null);
  const backToList = () => setSelectedVisitor(null);

  const filteredVisitors = visitors.filter((visitor) =>
    visitor.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFormFields = (visitor: Visitor, isEditForm: boolean) => {
    const fields = [
      { name: 'visitorName', label: 'Visitor Name *', type: 'text' },
      { name: 'meetingWith', label: 'Meeting With *', type: 'text' },
      { name: 'purpose', label: 'Purpose *', type: 'text' },
      { name: 'phone', label: 'Phone Number *', type: 'text' },
      { name: 'idCard', label: 'ID Card Number *', type: 'text' },
      { name: 'numOfPerson', label: 'Number of Persons *', type: 'number', min: 1 },
      { name: 'date', label: 'Date *', type: 'date' },
      { name: 'inTime', label: 'In Time *', type: 'time' },
      { name: 'outTime', label: 'Out Time *', type: 'time' },
    ];

    return fields.map((field, index) => (
      <div key={field.name}>
        <label style={styles.label}>{field.label}</label>
        <input
          type={field.type}
          name={field.name}
          value={visitor[field.name as keyof Visitor]}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e, index, isEditForm)}
          placeholder={field.label.replace(' *', '')}
          style={styles.input}
          min={field.min}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      </div>
    ));
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
      <h2 style={styles.heading}>Visitor List</h2>
      <input
        type="text"
        placeholder="Search by Visitor Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
      />
      <button onClick={addNewVisitor} style={styles.addButton}>
        ➕ Add Visitor
      </button>
      {loading && <div style={styles.loading}>Loading...</div>}
      {selectedVisitor ? (
        <div style={styles.detailsContainer}>
          <h3 style={styles.subHeading}>Visitor Details</h3>
          {Object.entries(selectedVisitor).map(([key, value]) => (
            key !== '_id' && (
              <p key={key} style={styles.detailItem}>
                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}: </strong> {value}
              </p>
            )
          ))}
          <button onClick={backToList} style={styles.backButton}>← Back</button>
        </div>
      ) : editingVisitor ? (
        <div style={styles.formContainer}>
          <h3 style={styles.subHeading}>Edit Visitor</h3>
          {renderFormFields(editingVisitor, true)}
          <div style={styles.buttonGroup}>
            <button onClick={saveEditedVisitor} style={styles.saveButton}>Save</button>
            <button onClick={cancelEdit} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      ) : newVisitor ? (
        <div style={styles.formContainer}>
          <h3 style={styles.subHeading}>Add New Visitor</h3>
          {renderFormFields(newVisitor, false)}
          <div style={styles.buttonGroup}>
            <button onClick={saveNewVisitor} style={styles.saveButton}>Add</button>
            <button onClick={cancelNewVisitor} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Visitor Name</th>
                <th style={styles.th}>Meeting With</th>
                <th style={styles.th}>Purpose</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map((visitor) => (
                <tr key={visitor._id} style={styles.tr}>
                  <td style={styles.td}>{visitor.visitorName}</td>
                  <td style={styles.td}>{visitor.meetingWith}</td>
                  <td style={styles.td}>{visitor.purpose}</td>
                  <td style={styles.td}>
                    <button onClick={() => viewVisitor(visitor)} style={styles.viewButton}>👁 View</button>
                    <button onClick={() => editVisitor(visitor)} style={styles.editButton}>✏ Edit</button>
                    <button onClick={() => deleteVisitorHandler(visitor._id)} style={styles.deleteButton}>❌ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={styles.recordCount}>Records: {filteredVisitors.length} of {visitors.length}</p>
        </div>
      )}
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
          border-radius: 8px;
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
        tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    backgroundColor: '#e8c897',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgb(239, 176, 17)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
  },
  detailsContainer: {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  formContainer: {
    background: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  detailItem: {
    margin: '5px 0',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '14px',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '14px',
  },
  backButton: {
    padding: '10px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tableContainer: {
    background: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    padding: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
  viewButton: {
    margin: '0 5px',
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    margin: '0 5px',
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: '#212529',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    margin: '0 5px',
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  loading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '16px',
    margin: '20px 0',
  },
  recordCount: {
    marginTop: '10px',
    color: '#333',
    fontSize: '14px',
    textAlign: 'right',
  },
};

export default VisitorList;