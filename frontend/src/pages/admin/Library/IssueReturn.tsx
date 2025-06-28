import React, { useState } from 'react';

const IssueReturn = () => {
  const initialMembersData = [
    { memberId: 29, libraryCardNo: "321", admissionNo: "18001", name: "Edward Thomas", memberType: "Student", phone: "98654646" },
    { memberId: 7, libraryCardNo: "00L3", admissionNo: "18002", name: "Robin Peterson", memberType: "Student", phone: "94655445" },
    { memberId: 23, libraryCardNo: "231", admissionNo: "18003", name: "Nicolas Fleming", memberType: "Student", phone: "54654646" },
    { memberId: 8, libraryCardNo: "01L5", admissionNo: "18005", name: "Glen Stark", memberType: "Student", phone: "965471234" },
    { memberId: 22, libraryCardNo: "845", admissionNo: "18006", name: "Simon Peterson", memberType: "Student", phone: "94655445" },
    { memberId: 9, libraryCardNo: "00185", admissionNo: "18007", name: "Brian Kohlar", memberType: "Student", phone: "94655445" },
    { memberId: 10, libraryCardNo: "0101", admissionNo: "18004", name: "Laura Clinton", memberType: "Student", phone: "54455454" },
    { memberId: 1, libraryCardNo: "100", admissionNo: "18008", name: "David Heart", memberType: "Student", phone: "64564544" },
    { memberId: 20, libraryCardNo: "675", admissionNo: "18012", name: "Emma Thomas", memberType: "Student", phone: "98654646" },
    { memberId: 21, libraryCardNo: "987", admissionNo: "18010", name: "Kriti Singh", memberType: "Student", phone: "16546515" },
    { memberId: 18, libraryCardNo: "210", admissionNo: "18009", name: "Kavya Roy", memberType: "Student", phone: "987561321" },
    { memberId: 24, libraryCardNo: "654", admissionNo: "18056", name: "Steffan Crown", memberType: "Student", phone: "7895412" },
    { memberId: 11, libraryCardNo: "12W", admissionNo: "18023", name: "Karuna Rana", memberType: "Student", phone: "7412589630" },
    { memberId: 17, libraryCardNo: "00120", admissionNo: "18014", name: "Dev Coinneach", memberType: "Student", phone: "789541230" },
    { memberId: 20, libraryCardNo: "695", admissionNo: "18028", name: "Rahul Sinha", memberType: "Student", phone: "741258930" },
    { memberId: 19, libraryCardNo: "254", admissionNo: "18029", name: "Rahul Sinha", memberType: "Student", phone: "6985471230" },
    { memberId: 15, libraryCardNo: "102L", admissionNo: "18025", name: "Jhonson wood", memberType: "Student", phone: "8776898979" },
    { memberId: 14, libraryCardNo: "001L", admissionNo: "18020", name: "Jhony Taylor", memberType: "Student", phone: "6787878" },
    { memberId: 25, libraryCardNo: "45", admissionNo: "18095", name: "Eliyana Jon", memberType: "Student", phone: "Jon" },
    { memberId: 28, libraryCardNo: "0021", admissionNo: "18080", name: "Oziva Heli", memberType: "Student", phone: "885458555" },
  ];

  const [members, setMembers] = useState(initialMembersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editedMember, setEditedMember] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    memberId: '', libraryCardNo: '', admissionNo: '', name: '', memberType: '', phone: ''
  });

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredMembers = initialMembersData.filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.memberType.toLowerCase().includes(term)
    );
    setMembers(filteredMembers);
  };

  const sortBy = (key) => {
    const sortedMembers = [...members].sort((a, b) => a[key].localeCompare(b[key]));
    setMembers(sortedMembers);
  };

  const handleAddMember = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewMember({ memberId: '', libraryCardNo: '', admissionNo: '', name: '', memberType: '', phone: '' });
  };

  const handleSaveNewMember = () => {
    setMembers([...members, { ...newMember, memberId: members.length + 1 }]);
    handleCloseModal();
    alert("New member added successfully!");
  };

  const handleChange = (e, isNewMember = false) => {
    const { name, value } = e.target;
    if (isNewMember) {
      setNewMember({ ...newMember, [name]: value });
    } else {
      setEditedMember({ ...editedMember, [name]: value });
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedMember({ ...members[index] });
  };

  const handleSave = (index) => {
    const updatedMembers = [...members];
    updatedMembers[index] = editedMember;
    setMembers(updatedMembers);
    setEditIndex(null);
    setEditedMember({});
    alert(`Member at index ${index} saved!`);
  };

  const handleDelete = (index) => {
    if (window.confirm(`Are you sure you want to delete the member at index ${index}?`)) {
      const updatedMembers = members.filter((_, i) => i !== index);
      setMembers(updatedMembers);
      alert(`Deleted member at index ${index}`);
    }
  };

  const handleReturn = (index) => {
    alert(`Return action triggered for member at index ${index}. Implement return logic here!`);
    // Add your return logic (e.g., update member status or trigger a return process)
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.headerContainer}>
        <h1 style={styles.heading}>Members</h1>
        <button style={styles.addButton} onClick={handleAddMember}>+ Add Member</button>
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
              <th style={styles.header} onClick={() => sortBy('memberId')}>Member ID</th>
              <th style={styles.header} onClick={() => sortBy('libraryCardNo')}>Library Card No.</th>
              <th style={styles.header} onClick={() => sortBy('admissionNo')}>Admission No.</th>
              <th style={styles.header} onClick={() => sortBy('name')}>Name</th>
              <th style={styles.header} onClick={() => sortBy('memberType')}>Member Type</th>
              <th style={styles.header} onClick={() => sortBy('phone')}>Phone</th>
              <th style={styles.header}>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} style={styles.row}>
                {editIndex === index ? (
                  <>
                    <td style={styles.cell}><input type="number" name="memberId" value={editedMember.memberId || ''} onChange={handleChange} style={styles.input} readOnly /></td>
                    <td style={styles.cell}><input type="text" name="libraryCardNo" value={editedMember.libraryCardNo || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="admissionNo" value={editedMember.admissionNo || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="name" value={editedMember.name || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="memberType" value={editedMember.memberType || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}><input type="text" name="phone" value={editedMember.phone || ''} onChange={handleChange} style={styles.input} /></td>
                    <td style={styles.cell}>
                      <button style={styles.saveButton} onClick={() => handleSave(index)}>Save</button>
                      <span style={styles.icon} onClick={() => setEditIndex(null)}>✖️</span>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.cell}>{member.memberId}</td>
                    <td style={styles.cell}>{member.libraryCardNo}</td>
                    <td style={styles.cell}>{member.admissionNo}</td>
                    <td style={styles.cell}>{member.name}</td>
                    <td style={styles.cell}>{member.memberType}</td>
                    <td style={styles.cell}>{member.phone}</td>
                    <td style={styles.cell}>
                      <span style={styles.icon} onClick={() => handleEdit(index)}>✏️</span>
                      <span style={styles.icon} onClick={() => handleReturn(index)}>🌀</span>
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
            <h2 style={styles.modalHeading}>Add New Member</h2>
            <div style={styles.formGroup}>
              <label>Member ID:</label>
              <input type="number" name="memberId" value={newMember.memberId} onChange={(e) => handleChange(e, true)} style={styles.input} readOnly />
            </div>
            <div style={styles.formGroup}>
              <label>Library Card No.:</label>
              <input type="text" name="libraryCardNo" value={newMember.libraryCardNo} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Admission No.:</label>
              <input type="text" name="admissionNo" value={newMember.admissionNo} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Name:</label>
              <input type="text" name="name" value={newMember.name} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Member Type:</label>
              <input type="text" name="memberType" value={newMember.memberType} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label>Phone:</label>
              <input type="text" name="phone" value={newMember.phone} onChange={(e) => handleChange(e, true)} style={styles.input} />
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.saveButton} onClick={handleSaveNewMember}>Save</button>
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
              height: 50%;
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
              height: 60%;
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
              height: 70%;
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
    display: 'flex',
    flexDirection: 'column',
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

export default IssueReturn;