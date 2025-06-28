import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputAdornment
} from '@mui/material';
import { Search, Close, Print, Delete, ArrowUpward } from '@mui/icons-material';
import { getAllCategoryCards } from "../../../redux/categoryRelated/categoryHandle";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";

interface IssueItem {
  id: number;
  item: string;
  category: string;
  issueDate: string;
  issueTo: string;
  issuedBy: string;
  quantity: number;
  note: string;
  status: 'Issued' | 'Returned';
}

const IssueItemList: React.FC = () => {
  const dispatch = useDispatch();
  const adminID = useSelector((state: any) => state.user.currentUser?._id);
  const { categoriesList } = useSelector((state: any) => state.category);

  const [items, setItems] = useState<IssueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<Omit<IssueItem, 'id' | 'status'>>({
    item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: 0, note: ''
  });

  useEffect(() => {
    if (adminID) {
      dispatch(getAllCategoryCards(adminID));
    }
  }, [dispatch, adminID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: number) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({
        item: itemToEdit.item, category: itemToEdit.category, issueDate: itemToEdit.issueDate,
        issueTo: itemToEdit.issueTo, issuedBy: itemToEdit.issuedBy, quantity: itemToEdit.quantity,
        note: itemToEdit.note
      });
      setEditingId(id);
      setShowPopup(true);
    }
  };

 /*  const handleIssueItem = () => {
    if (Object.values(newItem).every(value => Boolean(value))) {
      if (editingId !== null) {
        setItems(items.map(item => item.id === editingId ? { ...item, ...newItem } : item));
      } else {
        setItems([...items, { ...newItem, id: Date.now(), status: 'Issued' }]);
      }
      setNewItem({ item: '', category: '', issueDate: '', issueTo: '', issuedBy: '', quantity: 0, note: '' });
      setEditingId(null);
      setShowPopup(false);
    } else {
      toast.error('Please fill in all fields.');
    }
  }; */
  const handleIssueItem = () => {
  if (Object.values(newItem).every(value => Boolean(value))) {
    if (editingId !== null) {
      // Update existing
      setItems(items.map(item => 
        item.id === editingId ? { ...item, ...newItem } : item
      ));
      // Success message for update
      toast.success("Issue Item updated successfully!");
    } else {
      // Add new
      setItems([...items, { ...newItem, id: Date.now(), status: 'Issued' }]);
      // Success message for new issue
      toast.success("Issue Item Stocks Success!");
    }
    setNewItem({item:'',category:'',issueDate:'',issueTo:'',issuedBy:'',quantity:0,note:''});
    setEditingId(null);
    setShowPopup(false);
  } else {
    toast.error("Please fill all fields!");
  }
};

  const handleReturnItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'Returned' } : item));
     toast.success("Issue Item marked as Returned successfully!");
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm(`Delete item ${id}?`)) {
      setItems(items.filter(item => item.id !== id));
      toast.success(`Item ${id} deleted successfully!`);
    }
  };

  return (
    <div className="issue-container">
      <ToastContainer />
      <div className="header">
        <h2>Issue Item List</h2>
        <Button variant="contained" color="primary" onClick={() => setShowPopup(true)}>Issue Item</Button>
      </div>

      <div className="search-bar">
        <TextField
          variant="outlined" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} sx={{ width: 300 }}
        />
        <Select value={100} sx={{ width: 100 }}><MenuItem value={100}>100</MenuItem></Select>
        <IconButton><ArrowUpward /></IconButton>
        <IconButton><Print /></IconButton>
        <IconButton><Close /></IconButton>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Item', 'Note', 'Category', 'Issue Date', 'Issue To', 'Issued By', 'Quantity', 'Status', 'Action'].map(header => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.filter(item =>
              item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.category.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.note}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.issueDate}</TableCell>
                <TableCell>{item.issueTo}</TableCell>
                <TableCell>{item.issuedBy}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <span className={item.status === 'Returned' ? 'status-returned' : 'status-issued'}>{item.status}</span>
                </TableCell>
                <TableCell>
                  {item.status === 'Issued' && (
                    <Button variant="contained" color="secondary" onClick={() => handleReturnItem(item.id)} sx={{ mr: 1 }}>Return</Button>
                  )}
                  <IconButton onClick={() => handleDeleteItem(item.id)}><Delete color="error" /></IconButton>
                  <IconButton onClick={() => handleEdit(item.id)}><span role="img" aria-label="edit">✏️</span></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>{editingId !== null ? 'Edit Item' : 'Issue New Item'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Item" name="item" value={newItem.item} onChange={handleInputChange} />
          <Autocomplete
            options={categoriesList || []}
            getOptionLabel={(option: any) => option.category || ''}
            inputValue={categoryInput}
            onInputChange={(_, newInputValue) => setCategoryInput(newInputValue)}
            value={categoriesList.find((cat: any) => cat.category === newItem.category) || null}
            onChange={(_, newValue) => setNewItem(prev => ({ ...prev, category: newValue ? newValue.category : '' }))}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search or select category" variant="outlined" required
                InputProps={{ ...params.InputProps, style: { height: 36, fontSize: 14, backgroundColor: "#e0f7fa" } }} />
            )}
          />
          <TextField fullWidth margin="normal" label="Issue Date" type="date" name="issueDate"
            InputLabelProps={{ shrink: true }} value={newItem.issueDate} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Issue To" name="issueTo" value={newItem.issueTo} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Issued By" name="issuedBy" value={newItem.issuedBy} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Quantity" type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} />
          <TextField fullWidth margin="normal" label="Note" name="note" value={newItem.note} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPopup(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleIssueItem}>{editingId !== null ? 'Update' : 'Issue'}</Button>
        </DialogActions>
      </Dialog>
      
<style>{`
        .issue-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px; /* Small font size */
          min-height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          color: #333;
        }

        .issue-btn {
          padding: 8px 16px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .issue-btn:hover {
          background-color: #004d40;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .search-input, .status-filter {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .icons span {
          font-size: 18px;
          margin-left: 8px;
          cursor: pointer;
        }

        .issue-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .issue-table th, .issue-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .issue-table th {
          background-color: #00796b;
          color: white;
        }

        .table-row:hover {
          background-color: #f0f0f0;
        }

        .status-issued {
          color: #d32f2f;
          font-weight: bold;
        }

        .status-returned {
          color: #388e3c;
          font-weight: bold;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          margin-right: 8px;
          transition: transform 0.2s;
        }

        .return-btn {
          background-color: #d32f2f;
          color: white;
          padding: 4px 8px;
          border-radius: 5px;
        }

        .return-btn:hover {
          background-color: #b71c1c;
        }

        .delete-btn:hover {
          transform: scale(1.2);
          color: #b71c1c;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background-color: #fff;
          padding: 15px;
          border-radius: 5px;
          width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .popup-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .popup-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 15px;
        }

        .save-btn, .cancel-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn {
          background-color: #00796b;
          color: white;
        }

        .save-btn:hover {
          background-color: #004d40;
        }

        .cancel-btn {
          background-color: #ddd;
          color: #333;
        }

        .cancel-btn:hover {
          background-color: #bbb;
        }

        @media (max-width: 768px) {
          .issue-container {
            padding: 10px;
          }
          .issue-table th, .issue-table td {
            font-size: 12px;
            padding: 6px;
          }
          .popup-content {
            width: 90%;
          }
        }

        .issue-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        
       
        .MuiTable-root {
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .MuiTableCell-head {
          background-color: #00796b;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default IssueItemList;
