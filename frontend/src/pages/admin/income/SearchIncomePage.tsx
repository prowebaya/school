import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { searchIncomes, clearError } from '../../../redux/IncomeRelated/IncomeActions';

interface Income {
  _id: string;
  name: string;
  invoiceNumber: string;
  incomeHead: string;
  date: string;
  amount: number;
}

interface RootState {
  income: {
    incomes: Income[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

const SearchIncomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { incomes, loading, error } = useSelector((state: RootState) => state.income || {});
  const adminID = currentUser?._id;

  const [searchType, setSearchType] = useState('Last 12 Months');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (adminID) {
      dispatch(searchIncomes({ adminID, searchType, searchQuery }));
    } else {
      toast.error('Please log in to view incomes', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [adminID, searchType, searchQuery, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        onClose: () => dispatch(clearError()),
      });
    }
  }, [error, dispatch]);

  const filteredData = useMemo(() => {
    let result = [...incomes];
    const currentDate = new Date();

    if (searchType.includes('Months')) {
      const monthsAgo = new Date();
      const monthsCount = parseInt(searchType.split(' ')[1]);
      monthsAgo.setMonth(currentDate.getMonth() - monthsCount);

      result = result.filter(entry => {
        const [month, day, year] = entry.date.split('/').map(Number);
        const entryDate = new Date(year, month - 1, day);
        return entryDate >= monthsAgo;
      });
    } else if (searchType === 'Search') {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.name.toLowerCase().includes(query) ||
        entry.invoiceNumber.toLowerCase().includes(query)
      );
    } else if (searchType === 'Search By Income') {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.incomeHead.toLowerCase().includes(query) ||
        entry.amount.toString().includes(searchQuery)
      );
    }

    return result;
  }, [incomes, searchType, searchQuery]);

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#e8c897',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    searchSection: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '20px',
    },
    dropdown: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      width: '250px',
      fontSize: '14px',
    },
    searchInput: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      flexGrow: 1,
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
    thTd: {
      border: '1px solid #ddd',
      padding: '14px',
      textAlign: 'left',
    },
    th: {
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
    },
    detailsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    detailBox: {
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9',
    },
    heading: {
      marginTop: 0,
      color: '#333',
      fontSize: '18px',
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
      <div style={styles.searchSection}>
        <select 
          style={styles.dropdown}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
          <option>Search</option>
          <option>Search By Income</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={searchType.includes('Months')}
        />
      </div>

      {loading && <div style={styles.loading}>Loading...</div>}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.thTd, ...styles.th}}>Name</th>
              <th style={{...styles.thTd, ...styles.th}}>Invoice Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry._id}>
                <td style={styles.thTd}>{entry.name}</td>
                <td style={styles.thTd}>{entry.invoiceNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.detailsSection}>
        <div style={styles.detailBox}>
          <h3 style={styles.heading}>Income Head</h3>
          {filteredData.map((entry) => (
            <div key={entry._id}>{entry.incomeHead}</div>
          ))}
        </div>
        <div style={styles.detailBox}>
          <h3 style={styles.heading}>Date</h3>
          {filteredData.map((entry) => (
            <div key={entry._id}>{entry.date}</div>
          ))}
        </div>
        <div style={styles.detailBox}>
          <h3 style={styles.heading}>Amount (₹)</h3>
          {filteredData.map((entry) => (
            <div key={entry._id}>₹{entry.amount.toFixed(2)}</div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .Toastify__toast--error {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: #fff;
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
        tr:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default SearchIncomePage;