import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  fetchIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
  fetchIncomeHeads,
  clearError,
} from '../../../redux/IncomeRelated/IncomeActions';

interface Income {
  _id: string;
  incomeHead: string;
  name: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  document: string | null;
  description: string;
}

interface IncomeHead {
  _id: string;
  name: string;
  description: string;
}

interface RootState {
  income: {
    incomes: Income[];
    incomeHeads: IncomeHead[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const AddIncome: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { incomes, incomeHeads, loading, error } = useSelector((state: RootState) => state.income || {});
  const adminID = currentUser?._id;

  const initialFormData = {
    incomeHead: '',
    name: '',
    invoiceNumber: '',
    date: '',
    amount: '',
    document: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

  useEffect(() => {
    if (adminID) {
      dispatch(fetchIncomes(adminID));
      dispatch(fetchIncomeHeads(adminID));
    } else {
      toast.error('Please log in to view incomes', {
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

  const validateForm = (): string | null => {
    if (!formData.incomeHead.trim()) return 'Income head is required';
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.date) return 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Amount must be greater than 0';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fields = ['incomeHead', 'name', 'invoiceNumber', 'date', 'amount', 'document', 'description'];
      if (index < fields.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const incomeData = {
      incomeHead: formData.incomeHead,
      name: formData.name,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      amount: parseFloat(formData.amount),
      document: formData.document || null,
      description: formData.description || formData.name,
    };

    try {
      if (editId) {
        await dispatch(updateIncome({ id: editId, incomeData, adminID })).unwrap();
        toast.warn('Income updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        await dispatch(addIncome({ incomeData, adminID })).unwrap();
        toast.success('Income added successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setFormData(initialFormData);
      setEditId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save income', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (income: Income) => {
    setFormData({
      incomeHead: income.incomeHead,
      name: income.name,
      invoiceNumber: income.invoiceNumber,
      date: income.date,
      amount: income.amount.toString(),
      document: income.document || '',
      description: income.description,
    });
    setEditId(income._id);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteIncome({ id, adminID }));
    toast.error('Income deleted successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#e8c897',
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
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
    },
    button: {
      backgroundColor: editId !== null ? '#ffc107' : '#28a745',
      color: editId !== null ? '#212529' : 'white',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s',
      fontSize: '14px',
    },
    tableContainer: {
      background: '#fff',
      borderRadius: '5px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      padding: '10px',
      marginTop: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      borderBottom: '2px solid #ddd',
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      textAlign: 'center',
    },
    icon: {
      cursor: 'pointer',
      margin: '0 5px',
      color: '#555',
      fontSize: '16px',
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
      margin: '20px 0 10px',
    },
    loading: {
      textAlign: 'center',
      color: '#333',
      fontSize: '16px',
      margin: '20px 0',
    },
  };

  const renderFormFields = () => {
    const fields = [
      { name: 'incomeHead', label: 'Income Head *', type: 'select', options: incomeHeads.map(head => head.name) },
      { name: 'name', label: 'Name *', type: 'text' },
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
      { name: 'date', label: 'Date *', type: 'date' },
      { name: 'amount', label: 'Amount ($) *', type: 'number', step: '0.01', min: '0' },
      { name: 'document', label: 'Document', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
    ];

    return fields.map((field, index) => (
      <div key={field.name} style={styles.formGroup}>
        <label style={styles.label}>{field.label}</label>
        {field.type === 'select' ? (
          <select
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={styles.input}
            required={field.label.includes('*')}
            ref={(el) => (inputRefs.current[index] = el)}
          >
            <option value="">Select</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={field.label.replace(' *', '')}
            style={styles.input}
            step={field.step}
            min={field.min}
            required={field.label.includes('*')}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        )}
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
      <h1 style={styles.heading}>Add Income</h1>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <button type="submit" style={styles.button}>
          {editId !== null ? 'Update Income' : 'Add Income'}
        </button>
      </form>
      <h2 style={styles.subHeading}>Description</h2>
      {loading && <div style={styles.loading}>Loading...</div>}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Description', 'Invoice Number', 'Date', 'Income Head', 'Amount ($)', 'Actions'].map((header) => (
                <th key={header} style={styles.tableHeader}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incomes.map((entry) => (
              <tr key={entry._id}>
                <td style={styles.tableCell}>{entry.name}</td>
                <td style={styles.tableCell}>{entry.description}</td>
                <td style={styles.tableCell}>{entry.invoiceNumber}</td>
                <td style={styles.tableCell}>{entry.date}</td>
                <td style={styles.tableCell}>{entry.incomeHead}</td>
                <td style={styles.tableCell}>${entry.amount.toFixed(2)}</td>
                <td style={styles.tableCell}>
                  <FaEdit style={styles.icon} onClick={() => handleEdit(entry)} />
                  <FaTrash style={styles.icon} onClick={() => handleDelete(entry._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AddIncome;