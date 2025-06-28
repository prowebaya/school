import React, { useState } from 'react';

const BookList = () => {
  const initialBooksData = [
    { title: "Melodies of Diversity", description: "No Description", bookNumber: "80678", isbn: "WEWE0-678", publisher: "S.K.Publisher", author: "Eliva", subject: "ART and Culture", rackNumber: "789904", qty: 80, available: 72, price: "$90.00", postDate: "04/25/2025" },
    { title: "Diversity in the Living World", description: "No Description", bookNumber: "78990", isbn: "SDS98067", publisher: "D.K.Publisher", author: "Garry", subject: "Science", rackNumber: "7899-0", qty: 90, available: 83, price: "$60.00", postDate: "04/20/2025" },
    { title: "Farms Land", description: "No Description", bookNumber: "6452", isbn: "RTD07867", publisher: "S.K.Publisher", author: "Jacks", subject: "EVS-2", rackNumber: "3535", qty: 100, available: 94, price: "$100.00", postDate: "04/15/2025" },
    { title: "Best Friends", description: "No Description", bookNumber: "345234", isbn: "SDGFG9789B", publisher: "D.S.Publisher", author: "Albert", subject: "English", rackNumber: "7345", qty: 100, available: 97, price: "$120.00", postDate: "04/10/2025" },
    { title: "यात्रा की तैयारी", description: "No Description", bookNumber: "98075", isbn: "AWWE0E976", publisher: "S.K.Publisher", author: "Lokesh Sharma", subject: "Hindi", rackNumber: "78957", qty: 85, available: 78, price: "$90.00", postDate: "04/05/2025" },
    { title: "Shapes Around us", description: "No Description", bookNumber: "45332", isbn: "AS9080678", publisher: "S.K.Publisher", author: "G.S.Martin", subject: "Mathematics", rackNumber: "4535", qty: 100, available: 96, price: "$85.00", postDate: "04/01/2025" },
    { title: "Major Landforms of the Earth", description: "No Description", bookNumber: "78564", isbn: "ASA76854", publisher: "D.K.Publisher", author: "Tarun", subject: "EVS 2", rackNumber: "78453", qty: 100, available: 93, price: "$100.00", postDate: "03/25/2025" },
    { title: "यात्रा की तैयारी", description: "No Description", bookNumber: "56745", isbn: "DAS8976", publisher: "S.K.Publisher", author: "Ankit Sinha", subject: "Hindi", rackNumber: "567345", qty: 90, available: 85, price: "$65.00", postDate: "02/15/2025" },
    { title: "Desert Animals", description: "No Description", bookNumber: "5463", isbn: "DFF8975", publisher: "S.K.Publisher", author: "Peter", subject: "English", rackNumber: "7685", qty: 80, available: 78, price: "$65.00", postDate: "02/10/2025" },
    { title: "Global Longitudes and Latitudes", description: "No Description", bookNumber: "45234", isbn: "SD890567", publisher: "D.K.Publisher", author: "Kalvin", subject: "Social Studies", rackNumber: "34222", qty: 80, available: 71, price: "$80.00", postDate: "03/20/2025" },
    { title: "Electricity and Circuits", description: "No Description", bookNumber: "23456", isbn: "SQW98080", publisher: "S.K.Publisher", author: "John Wood", subject: "Science", rackNumber: "34521", qty: 80, available: 76, price: "$85.00", postDate: "03/05/2025" },
    { title: "Basic Geometric Ideas", description: "No Description", bookNumber: "56723", isbn: "SDA9067", publisher: "S.K.Publisher", author: "David", subject: "Mathematics", rackNumber: "34123", qty: 80, available: 71, price: "$100.00", postDate: "03/01/2025" },
    { title: "CHAPTER 3 Portraying People", description: "No Description", bookNumber: "QR890784", isbn: "ERW78945", publisher: "S.D.Publisher", author: "William", subject: "EVS II", rackNumber: "1231", qty: 80, available: 74, price: "$120.00", postDate: "02/20/2025" },
  ];

  const [books, setBooks] = useState(initialBooksData);
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '', description: '', bookNumber: '', isbn: '', publisher: '', author: '', subject: '', rackNumber: '', qty: '', available: '', price: '', postDate: ''
  });

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredBooks = initialBooksData.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.subject.toLowerCase().includes(term)
    );
    setBooks(filteredBooks);
  };

  const sortBy = (key) => {
    const sortedBooks = [...books].sort((a, b) => {
      if (key === 'price') {
        return parseFloat(a[key].replace('$', '')) - parseFloat(b[key].replace('$', ''));
      }
      return a[key].localeCompare(b[key]);
    });
    setBooks(sortedBooks);
  };

  const handleAddBook = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBook({ title: '', description: '', bookNumber: '', isbn: '', publisher: '', author: '', subject: '', rackNumber: '', qty: '', available: '', price: '', postDate: '' });
  };

  const handleSaveNewBook = () => {
    setBooks([...books, newBook]);
    handleCloseModal();
    alert("New book added successfully!");
  };

  const handleChange = (e, isNewBook = false) => {
    const { name, value } = e.target;
    if (isNewBook) {
      setNewBook({ ...newBook, [name]: value });
    } else {
      setEditedBook({ ...editedBook, [name]: value });
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedBook({ ...books[index] });
  };

  const handleSave = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index] = editedBook;
    setBooks(updatedBooks);
    setEditIndex(null);
    setEditedBook({});
    alert(`Book at index ${index} saved!`);
  };

  const handleDelete = (index) => {
    if (window.confirm(`Are you sure you want to delete the book at index ${index}?`)) {
      const updatedBooks = books.filter((_, i) => i !== index);
      setBooks(updatedBooks);
      alert(`Deleted book at index ${index}`);
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.headerContainer}>
        <h1 style={styles.heading}>Book List</h1>
        <button style={styles.addButton} onClick={handleAddBook}>+ Add Book</button>
      </div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.bookTable}>
          <thead>
            <tr>
              <th style={styles.header} onClick={() => sortBy('title')}>Book Title</th>
              <th style={styles.header} onClick={() => sortBy('description')}>Description</th>
              <th style={styles.header} onClick={() => sortBy('bookNumber')}>Book Number</th>
              <th style={styles.header} onClick={() => sortBy('isbn')}>ISBN Number</th>
              <th style={styles.header} onClick={() => sortBy('publisher')}>Publisher</th>
              <th style={styles.header} onClick={() => sortBy('author')}>Author</th>
              <th style={styles.header} onClick={() => sortBy('subject')}>Subject</th>
              <th style={styles.header} onClick={() => sortBy('rackNumber')}>Rack Number</th>
              <th style={styles.header} onClick={() => sortBy('qty')}>Qty</th>
              <th style={styles.header} onClick={() => sortBy('available')}>Available</th>
              <th style={styles.header} onClick={() => sortBy('price')}>Book Price</th>
              <th style={styles.header} onClick={() => sortBy('postDate')}>Post Date</th>
              <th style={styles.header}>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index} style={styles.row}>
                {editIndex === index ? (
                  <>
                    <td style={styles.cell}><input type="text" name="title" value={editedBook.title || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="description" value={editedBook.description || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="bookNumber" value={editedBook.bookNumber || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="isbn" value={editedBook.isbn || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="publisher" value={editedBook.publisher || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="author" value={editedBook.author || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="subject" value={editedBook.subject || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="rackNumber" value={editedBook.rackNumber || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="number" name="qty" value={editedBook.qty || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="number" name="available" value={editedBook.available || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="price" value={editedBook.price || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="postDate" value={editedBook.postDate || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}>
                      <button style={styles.saveButton} onClick={() => handleSave(index)}>Save</button>
                      <span style={styles.icon} onClick={() => setEditIndex(null)}>✖️</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.cell}>{book.title}</td>
                    <td style={styles.cell}>{book.description}</td>
                    <td style={styles.cell}>{book.bookNumber}</td>
                    <td style={styles.cell}>{book.isbn}</td>
                    <td style={styles.cell}>{book.publisher}</td>
                    <td style={styles.cell}>{book.author}</td>
                    <td style={styles.cell}>{book.subject}</td>
                    <td style={styles.cell}>{book.rackNumber}</td>
                    <td style={styles.cell}>{book.qty}</td>
                    <td style={styles.cell}>{book.available}</td>
                    <td style={styles.cell}>{book.price}</td>
                    <td style={styles.cell}>{book.postDate}</td>
                    <td style={styles.cell}>
                      <span style={styles.icon} onClick={() => handleEdit(index)}>✏️</span>
                      <span style={styles.icon} onClick={() => handleDelete(index)}>🗑️</span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeading}>Add New Book</h2>
            <div style={styles.formGroup}>
              <label>Title:</label>
              <input type="text" name="title" value={newBook.title} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Description:</label>
              <input type="text" name="description" value={newBook.description} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Book Number:</label>
              <input type="text" name="bookNumber" value={newBook.bookNumber} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>ISBN Number:</label>
              <input type="text" name="isbn" value={newBook.isbn} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Publisher:</label>
              <input type="text" name="publisher" value={newBook.publisher} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Author:</label>
              <input type="text" name="author" value={newBook.author} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Subject:</label>
              <input type="text" name="subject" value={newBook.subject} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Rack Number:</label>
              <input type="text" name="rackNumber" value={newBook.rackNumber} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Qty:</label>
              <input type="number" name="qty" value={newBook.qty} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Available:</label>
              <input type="number" name="available" value={newBook.available} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Price:</label>
              <input type="text" name="price" value={newBook.price} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Post Date:</label>
              <input type="text" name="postDate" value={newBook.postDate} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={handleSaveNewBook}>Save</button>
              <button style={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 1024px) {
            .book-table {
              font-size: 12px;
            }
            .cell, .header {
              padding: 6px;
            }
            .search-input {
              width: 200px;
            }
            .input {
              font-size: 12px;
              padding: 4px;
            }
            .modal {
              width: 45%;
              height: 80%;
            }
          }

          @media (max-width: 768px) {
            .book-table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
            }
            .cell, .header {
              min-width: 80px;
              padding: 4px;
            }
            .search-input {
              width: 150px;
            }
            .input {
              font-size: 10px;
              padding: 2px;
            }
            .modal {
              width: 50%;
              height: 85%;
            }
          }

          @media (max-width: 480px) {
            .heading {
              font-size: 18px;
            }
            .search-input {
              width: 120px;
              font-size: 12px;
            }
            .cell, .header {
              min-width: 60px;
              font-size: 10px;
              padding: 2px;
            }
            .icon {
              font-size: 14px;
              margin: 0 2px;
            }
            .input {
              font-size: 8px;
              padding: 1px;
            }
            .modal {
              width: 80%;
              height: 90%;
            }
            .add-button {
              padding: 6px 10px;
              font-size: 12px;
            }
            .save-button {
              font-size: 10px;
              padding: 2px 6px;
            }
            .cancel-button {
              font-size: 10px;
              padding: 2px 6px;
            }
          }
        `}
      </style>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  appContainer: {
    padding: '10px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    position: 'relative',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    margin: '0',
    flexGrow: 1,
    fontSize: '20px',
  },
  searchContainer: {
    marginBottom: '10px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '6px',
    width: '250px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '12px',
    boxSizing: 'border-box',
  },
  tableWrapper: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
  bookTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    fontSize: '12px',
  },
  header: {
    padding: '6px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  row: {
    backgroundColor: '#f9f9f9',
  },
  'row:hover': {
    backgroundColor: '#f1f1f1',
  },
  cell: {
    padding: '4px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    whiteSpace: 'nowrap',
    fontSize: '12px',
  },
  icon: {
    cursor: 'pointer',
    margin: '0 4px',
    fontSize: '16px',
  },
  'icon:hover': {
    color: '#ff4444',
  },
  input: {
    width: '100%',
    padding: '4px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '2px',
    boxSizing: 'border-box',
  },
  saveButton: {
    padding: '4px 8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '4px',
  },
  'saveButton:hover': {
    backgroundColor: '#45a049',
  },
  addButton: {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '10px',
  },
  'addButton:hover': {
    backgroundColor: '#45a049',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    width: '50%',
    height: '50%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    position: 'relative',
  },
  modalHeading: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '4px 8px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  'cancelButton:hover': {
    backgroundColor: '#d32f2f',
  },
};

export default BookList;