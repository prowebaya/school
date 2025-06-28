import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from '../../../redux/FrontOffice/Enquiry/frontOfficeHandler';

interface FrontOfficeEntry {
  _id: string;
  name: string;
  description: string;
  type: string;
}

interface EntriesState {
  Purpose: FrontOfficeEntry[];
  'Complaint Type': FrontOfficeEntry[];
  Source: FrontOfficeEntry[];
  Reference: FrontOfficeEntry[];
}

interface RootState {
  frontOffice: {
    entries: EntriesState;
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const TABS = ['Purpose', 'Complaint Type', 'Source', 'Reference'] as const;
type Tab = typeof TABS[number];

const FrontOffice: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { entries, loading, error } = useSelector((state: RootState) => state.frontOffice || {});
  const adminID = currentUser?._id;

  const [activeTab, setActiveTab] = useState<Tab>('Purpose');
  const [newEntry, setNewEntry] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    console.log('adminID:', adminID, 'activeTab:', activeTab);
    if (adminID) {
      dispatch(fetchEntries(adminID, activeTab));
    } else {
      toast.error('Please log in to view entries', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [activeTab, adminID, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleAddOrEdit = () => {
    if (!newEntry.trim()) {
      toast.error('Entry name is required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const entryData = { name: newEntry, description, type: activeTab };

    if (editingId) {
      dispatch(updateEntry(editingId, entryData, adminID));
      toast.warn('Entry updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      dispatch(addEntry(entryData, adminID));
      toast.success('Entry added successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    setNewEntry('');
    setDescription('');
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteEntry(id, adminID, activeTab));
    toast.error('Entry deleted successfully', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleEdit = (item: FrontOfficeEntry) => {
    setNewEntry(item.name);
    setDescription(item.description);
    setEditingId(item._id);
  };

  const filteredEntries = entries[activeTab]?.filter((item: FrontOfficeEntry) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

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
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
      <div style={styles.sidebar}>
        {TABS.map((tab) => (
          <p
            key={tab}
            style={activeTab === tab ? styles.activeMenu : styles.menuItem}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </p>
        ))}
      </div>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Add {activeTab}</h2>
        <label>{activeTab} *</label>
        <input
          type="text"
          style={styles.input}
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <label>Description</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button style={styles.button} onClick={handleAddOrEdit}>
          {editingId ? 'Update' : 'Save'}
        </button>
      </div>
      <div style={styles.listContainer}>
        <h2 style={styles.heading}>{activeTab} List</h2>
        <input
          type="text"
          placeholder="Search..."
          style={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table style={styles.table}>
          <thead>
            <tr>
              <th>{activeTab}</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((item: FrontOfficeEntry) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <button style={styles.editBtn} onClick={() => handleEdit(item)}>
                    ✏️
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Records: {filteredEntries.length} of {(entries[activeTab] || []).length}</p>
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
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#e8c897',
  },
  sidebar: {
    width: '200px',
    background: '#fff',
    padding: '20px',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
  },
  activeMenu: {
    fontWeight: 'bold',
    color: 'blue',
    cursor: 'pointer',
  },
  menuItem: {
    cursor: 'pointer',
  },
  formContainer: {
    flex: 1,
    background: '#fff',
    padding: '20px',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
  },
  listContainer: {
    flex: 2,
    background: '#fff',
    padding: '20px',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
  },
  button: {
    background: '#444',
    color: '#fff',
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  editBtn: {
    marginRight: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default FrontOffice;