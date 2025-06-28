import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
//for messages
import { ToastContainer } from "react-toastify";
//for dropdown serch
import Autocomplete from "@mui/material/Autocomplete";

import{
getAllItemStocks,
getItemStockDetails,
createItemStock,
updateItemStock,
deleteItemStock,
clearItemStockErrorAction,
}  from "../../../redux/InventoryAddItemStocks/itemStockHandle.js";
// for get all categores lists
import { getAllCategories } from "../../../redux/categoryRelated/categoryHandle";
import { getAllItems } from "../../../redux/iteminventoryRelated/itemHandle";
import { getAllStores } from "../../../redux/storeItemRelated/storeHandle.js"; // create this
import { getAllSupplier } from "../../../redux/supplierRelated/supplierHandle.js";

interface Item {
  id: number;
  item: string;
  category: string;
  supplier: string;
  store: string;
  
  quantity: number | string;
  purchasePrice: number | string;
  purchaseDate: string;
  document?: string;
  description?: string;
}
//const AddItemStocks = () => {
const AddItemStocks: React.FC = () => {
  const dispatch = useDispatch();
  /*   const [items, setItems] = useState([
    { id: 1, item: 'Projectors', category: 'Chemistry Lab Apparatus', supplier: 'Camlin Stationers', store: 'Chemistry Equipment (Ch201)', quantity: 15, purchasePrice: 180.00, purchaseDate: '04/30/2025' },
    { id: 2, item: 'Notebooks', category: 'Books Stationery', supplier: 'Camlin Stationers', store: 'Science Store (SC2)', quantity: 50, purchasePrice: 200.00, purchaseDate: '04/25/2025' },
    { id: 3, item: 'Staff Uniform', category: 'Staff Dress', supplier: 'Jhonson Uniform Dress', store: 'Uniform Dress Store (UND23)', quantity: 10, purchasePrice: 150.00, purchaseDate: '04/20/2025' },
    { id: 4, item: 'Equipment', category: 'Chemistry Lab Apparatus', supplier: 'Jhon smith Supplier', store: 'Chemistry Equipment (Ch201)', quantity: 20, purchasePrice: 150.00, purchaseDate: '04/15/2025' },
    { id: 5, item: 'Table chair', category: 'Furniture', supplier: 'David Furniture', store: 'Furniture Store (FS342)', quantity: 20, purchasePrice: 150.00, purchaseDate: '04/10/2025' },
  ]); */
  //const items = useSelector((state: any) => state.items.itemsList);

  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState({
    item: "",
    category: "",
    supplier: "",
    store: "",
    quantity: "",
    purchasePrice: "",
    purchaseDate: "",
    document: "",
    description: "",
  });

  //const [categories] = useState(['Select', 'Chemistry Lab Apparatus', 'Books Stationery', 'Staff Dress', 'Furniture', 'Sports']);
  const adminID = useSelector((state: any) => state.user.currentUser?._id);

  const { categoriesList } = useSelector((state: any) => state.category);
  const { itemsList } = useSelector((state: any) => state.items);
  const [items, setItems] = useState<Item[]>([]);
  // Redux से डेटा प्राप्त करें
const { 
  suppliersList,
  loading: supLoading,
  error: supError 
} = useSelector((state: any) => state.supplier);

const { 
  storesList,
  loading: storeLoading,
  error: storeError 
} = useSelector((state: any) => state.store);
  const processedItems = itemsList
    .filter((item) => item._id && item.itemName) // ensure valid data
    .map((item, index) => ({
      ...item,
      _id: item._id || `temp-${index}`, // fallback unique key
    }));

  // const [searchTerm, setSearchTerm] = useState('');
  /* const [newItem, setNewItem] = useState<Item>({
    id: 0,
    item: '',
    category: '',
    supplier: '',
    store: '',
    quantity: '',
    purchasePrice: 0,
    purchaseDate: '',
    document: '',
    description: ''
  }); */
  //const [form, setForm] = useState({ category: "", item: "" });
  const [form, setForm] = useState({category: "",item: "",supplier: "",store: "" });
  const [categoryInput, setCategoryInput] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [supplierInput, setSupplierInput] = useState("");
  const [storeInput, setStoreInput] = useState("");

  useEffect(() => {
    if (adminID) {
      dispatch(getAllCategories(adminID));

      dispatch(getAllItems(adminID));
      /*  console.log("Items List:", itemsList); */
      dispatch(getAllStores(adminID));
      dispatch(getAllSupplier(adminID));
    }
  }, [dispatch, adminID]);

  useEffect(() => {
  //console.log("Suppliers:", suppliersList);
  //console.log("Stores:", storesList);
}, [suppliersList, storesList]);

  useEffect(() => {
    if (itemsList.length > 0) {
     // console.log("Items fetched successfully:", itemsList);
    }
  }, [itemsList]);

  const filteredCategories = categoriesList.filter((cat) =>
    cat.category.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const filteredItems = itemsList.filter((item) =>
    item.item.toLowerCase().includes(itemInput.toLowerCase())
  );

/*   const suppliers = [
    "Select",
    "Camlin Stationers",
    "Jhonson Uniform Dress",
    "Jhon smith Supplier",
    "David Furniture",
  ];

  const stores = [
    "Select",
    "Chemistry Equipment (Ch201)",
    "Science Store (SC2)",
    "Uniform Dress Store (UND23)",
    "Furniture Store (FS342)",
    "Sports Store (sp55)",
  ];
 */



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    if (
      newItem.item &&
      newItem.category !== "Select" &&
      newItem.supplier !== "Select" &&
      newItem.store !== "Select" &&
      newItem.quantity &&
      newItem.purchasePrice &&
      newItem.purchaseDate
    ) {
      const newEntry: Item = {
        ...newItem,
        id: Date.now(),
        purchasePrice: parseFloat(String(newItem.purchasePrice)),
      };
      setItems([...items, newEntry]);
      setNewItem({
        id: 0,
        item: "",
        category: "",
        supplier: "",
        store: "",
        quantity: "",
        purchasePrice:"",
        purchaseDate: "",
        document: "",
        description: "",
      });
    } else {
      alert("Please fill all required fields (*).");
    }
  };

  /*  const handleEdit = (id) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit, document: '', description: '' }); // Reset document and description for edit
      setItems(items.filter(item => item.id !== id)); // Remove old item to replace with edited one
    }
  }; */
  const handleEdit = (id: number) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setNewItem({ ...itemToEdit });
      setItems(items.filter((item) => item.id !== id));
    }
  };

  /* const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete item with ID: ${id}?`)) {
      setItems(items.filter(item => item.id !== id));
    }
  };
 */
  const handleDelete = (id: number) => {
    if (
      window.confirm(`Are you sure you want to delete item with ID: ${id}?`)
    ) {
      setItems(items.filter((item) => item.id !== id));
    }
  };
  return (
    <div className="stock-container">
      <div className="stock-header">
        <div className="add-form">
          <h2>Add Item Stock</h2>
          {/* <div className="form-group">
            <label>Item Category *</label>
            <select name="category" value={newItem.category} onChange={handleInputChange} className="form-input">
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div> */}
          <div className="form-group">
            <label>Category *</label>
            <Autocomplete
              options={filteredCategories}
              getOptionLabel={(option) => option.category}
              inputValue={categoryInput}
              onInputChange={(_, newValue) => setCategoryInput(newValue)}
              value={
                categoriesList.find((cat) => cat._id === form.category) || null
              }
              onChange={(_, newValue) => {
                const selectedCategoryId = newValue?._id || "";
                setForm((prev) => ({ ...prev, category: selectedCategoryId }));
                handleInputChange({
                  target: {
                    name: "category",
                    value: selectedCategoryId,
                  },
                } as any);
              }}
              renderInput={(params) => (
                <TextField
                
                  {...params}
                  placeholder="Search or select category"
                  variant="outlined"
                  required
                   InputProps={{
          ...params.InputProps,
          style: { height: 36, fontSize: 14 ,backgroundColor: '#e0f7fa'}, // Reduce height and font size
        }}
                  
                />
              )}
            />
          </div>

          <div className="form-group">
            <label>Item *</label>
            <Autocomplete
              options={itemsList
                .filter(
                  (item) =>
                    newItem.category && item.category._id === newItem.category // Category ID match करें
                )
                .filter((item) =>
                  item.item.toLowerCase().includes(itemInput.toLowerCase())
                )}
              getOptionLabel={(option) => option.item || "Unnamed Item"}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              inputValue={itemInput}
              onInputChange={(_, newValue) => setItemInput(newValue)}
              value={itemsList.find((itm) => itm._id === newItem.item) || null}
              onChange={(_, newValue) => {
                setNewItem((prev) => ({
                  ...prev,
                  item: newValue?._id || "",
                  category: newValue?.category?._id || prev.category, // Category ID सेट करें
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search or select item"
                  variant="outlined"
                  required
                   InputProps={{
          ...params.InputProps,
          style: { height: 36, fontSize: 14 ,backgroundColor: '#e0f7fa'}, // Reduce height and font size
        }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  {option.item}
                  <span style={{ marginLeft: "10px", color: "#666" }}>
                    {/* ({option.category?.category}) */}
                  </span>
                </li>
              )}
            />
          </div>
          {/* <div className="form-group">
            <label>Supplier</label>
            <select
              name="supplier"
              value={newItem.supplier}
              onChange={handleInputChange}
              className="form-input"
            >
              {suppliers.map((sup, index) => (
                <option key={index} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div> */}
          
<div className="form-group">
  <label>Supplier</label>
  <Autocomplete
    options={suppliersList}
    getOptionLabel={(option) => {
      // डेटा स्ट्रक्चर verify करें
     // console.log("Supplier Option:", option);
      return option.name || option.supplierName || 'Unnamed Supplier';
    }}
    inputValue={supplierInput}
    onInputChange={(_, newValue) => setSupplierInput(newValue)}
    value={suppliersList.find(sup => sup._id === form.supplier) || null}
    onChange={(_, newValue) => {
      setForm(prev => ({
        ...prev,
        supplier: newValue?._id || ""
      }));
      setNewItem(prev => ({
        ...prev,
        supplier: newValue?._id || ""
      }));
    }}
    renderInput={(params) => (
      <TextField 
        {...params} 
        placeholder="Search supplier" 
        variant="outlined" 
        required 
         InputProps={{
          ...params.InputProps,
          style: { height: 36, fontSize: 14 ,backgroundColor: '#e0f7fa'}, // Reduce height and font size
        }}
      />
    )}
  />
</div>
          {/* <div className="form-group">
            <label>Store</label>
            <select
              name="store"
              value={newItem.store}
              onChange={handleInputChange}
              className="form-input"
            >
              {stores.map((sto, index) => (
                <option key={index} value={sto}>
                  {sto}
                </option>
              ))}
            </select>
          </div> */}
          {/* // Store Autocomplete */}
<div className="form-group">
  <label>Store</label>
  <Autocomplete
    options={storesList}
    getOptionLabel={(option) => 
      //`${option.storeName} (${option.storeCode})` || 'Unnamed Store'
       `${option.storeName} ` || 'Unnamed Store'
    }
    inputValue={storeInput}
    onInputChange={(_, newValue) => setStoreInput(newValue)}
    value={storesList.find(store => store._id === form.store) || null}
    onChange={(_, newValue) => {
      setForm(prev => ({
        ...prev,
        store: newValue?._id || ""
      }));
      // यदि newItem में भी store सेव करना है तो
      setNewItem(prev => ({
        ...prev,
        store: newValue?._id || ""
      }));
    }}
    renderInput={(params) => (
      <TextField 
        {...params} 
        placeholder="Search store" 
        variant="outlined" 
        required 
         InputProps={{
          ...params.InputProps,
          style: { height: 36, fontSize: 14 ,backgroundColor: '#e0f7fa'}, // Reduce height and font size
        }}
      />
    )}
  />
</div>
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Purchase Price ($)*</label>
            <input
              type="number"
              step="0.01"
              name="purchasePrice"
              value={newItem.purchasePrice}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="purchaseDate"
              value={newItem.purchaseDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Attach Document</label>
            <input
              type="file"
              name="document"
              onChange={handleInputChange}
              className="form-input file-input"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              className="form-input textarea"
            />
          </div>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="stock-list">
          <h2>Item Stock List</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="icons">
              <span role="img" aria-label="export">
                📤
              </span>
              <span role="img" aria-label="print">
                🖨️
              </span>
              <span role="img" aria-label="close">
                ❌
              </span>
            </div>
          </div>
          <table className="stock-table">
            <thead>
              <tr>
                {[
                  "Item",
                  "Category",
                  "Supplier",
                  "Store",
                  "Quantity",
                  "Purchase Date",
                  "Price ($)",
                  "Action",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items
                .filter(
                  (item) =>
                    item.item
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.category
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id} className="table-row">
                    <td>{item.item}</td>
                    <td>{item.category}</td>
                    <td>{item.supplier}</td>
                    <td>{item.store}</td>
                    <td>{item.quantity}</td>
                    <td>{item.purchaseDate}</td>
                    <td>{item.purchasePrice.toFixed(2)}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(item.id)}
                      >
                        <span role="img" aria-label="edit">
                          ✏️
                        </span>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <span role="img" aria-label="delete">
                          ❌
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stock-container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px; /* Small font size as per previous request */
          min-height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }

        .stock-header {
          display: flex;
          gap: 20px;
        }

        h2 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .add-form, .stock-list {
          background-color: #fff;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .file-input {
          padding: 8px 0;
        }

        .textarea {
          height: 60px;
          resize: vertical;
        }

        .save-btn {
          padding: 10px 20px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn:hover {
          background-color: #004d40;
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .search-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .icons span {
          font-size: 18px;
          margin-left: 10px;
          cursor: pointer;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
        }

        .stock-table th, .stock-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .stock-table th {
          background-color: #00796b;
          color: white;
        }

        .table-row:hover {
          background-color: #f0f0f0;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin-right: 8px;
          transition: transform 0.2s;
        }

        .edit-btn {
          color: #388e3c;
        }

        .delete-btn {
          color: #d32f2f;
        }

        .action-btn:hover {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .stock-header {
            flex-direction: column;
          }
          .stock-table th, .stock-table td {
            font-size: 12px;
            padding: 6px;
          }
          .form-input {
            font-size: 12px;
          }
                    .save-btn {
          padding: 10px 20px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .save-btn:hover {
          background-color: #004d40;
        }

        .stock-list {
          flex: 1;
          width: 100%;
        }

        .search-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .search-input {
          flex: 1;
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .icons span {
          margin-left: 10px;
          cursor: pointer;
          font-size: 18px;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
        }

        .stock-table th, .stock-table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }

        .stock-table th {
          background-color: #f0f0f0;
        }

        .table-row:hover {
          background-color: #e0f7fa;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
        }

        .edit-btn {
          color: #1976d2;
        }

        .delete-btn {
          color: #d32f2f;
        }

        @media (max-width: 768px) {
          .stock-header {
            flex-direction: column;
          }

          .add-form, .stock-list {
            width: 100%;
          }
        }

        }
      `}</style>
    </div>
  );
};

export default AddItemStocks;
