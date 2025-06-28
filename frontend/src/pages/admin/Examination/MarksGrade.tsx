import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import 'react-toastify/dist/ReactToastify.css';
import './MarkGrade.css'; // 👈 CSS import (create this file)

import {
  getAllMarkGradeDivisions,
  createMarkGradeDivision,
  updateMarkGradeDivision,
  deleteMarkGradeDivision,
  clearMarkGradeDivisionErrorAction
} from '../../../redux/markGradeRelated/markGradeHandle';

const MarkGrade = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  const { markGradeDivisionsList: divisions = [], loading, error } = useSelector((state) => state.markGrade);

  const [newDivision, setNewDivision] = useState({ name: '', from: '', to: '' });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const nameRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const inputRefs = [nameRef, fromRef, toRef];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllMarkGradeDivisions(adminID));
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMarkGradeDivisionErrorAction());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!newDivision.name.trim()) newErrors.name = 'Division name is required';
    if (isNaN(newDivision.from) || newDivision.from === '') newErrors.from = 'Invalid percentage';
    if (isNaN(newDivision.to) || newDivision.to === '') newErrors.to = 'Invalid percentage';
    if (parseFloat(newDivision.from) >= parseFloat(newDivision.to)) {
      newErrors.range = '"From" percentage must be less than "To" percentage';
    }
    return newErrors;
  };

  const handleAddDivision = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      name: newDivision.name,
      from: parseFloat(newDivision.from),
      to: parseFloat(newDivision.to),
      adminID
    };
    if (editingId) {
      dispatch(updateMarkGradeDivision(editingId, payload));
      toast.success(`Mark Grade ${payload.name} updated successfully!`);
    } else {
      dispatch(createMarkGradeDivision(payload));
      toast.success(`Mark Grade ${payload.name} created successfully!`);
    }
    setNewDivision({ name: '', from: '', to: '' });
    setEditingId(null);
    setErrors({});
    nameRef.current?.focus();
  };

  const handleEdit = (division) => {
    setNewDivision({
      name: division.name,
      from: division.from.toString(),
      to: division.to.toString()
    });
    setEditingId(division._id);
    setTimeout(() => nameRef.current?.focus(), 0);
  };

  const handleDelete = (id, name) => {
    dispatch(deleteMarkGradeDivision(id, adminID));
    toast.success(`Mark Grade ${name} deleted successfully!`);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % inputRefs.length;
      inputRefs[nextIndex].current?.focus();
    }
  };

  const filteredDivisions = divisions.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const pageCount = Math.ceil(filteredDivisions.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredDivisions.slice(offset, offset + itemsPerPage);

  return (
    <div className="mark-grade-container">
      <ToastContainer />
      <h2>{editingId ? 'Edit Marks Division' : 'Add Marks Division'}</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Division"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
          {[5, 10, 20, 30].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>

      <div className="input-group">
        <input ref={nameRef} type="text" placeholder="Name" value={newDivision.name} onChange={(e) => setNewDivision({ ...newDivision, name: e.target.value })} onKeyDown={(e) => handleKeyDown(e, 0)} />
        <input ref={fromRef} type="number" placeholder="From %" value={newDivision.from} onChange={(e) => setNewDivision({ ...newDivision, from: e.target.value })} onKeyDown={(e) => handleKeyDown(e, 1)} />
        <input ref={toRef} type="number" placeholder="To %" value={newDivision.to} onChange={(e) => setNewDivision({ ...newDivision, to: e.target.value })} onKeyDown={(e) => handleKeyDown(e, 2)} />
        <button onClick={handleAddDivision}>{editingId ? 'Update' : 'Add'}</button>
        {editingId && <button onClick={() => { setEditingId(null); setNewDivision({ name: '', from: '', to: '' }); }}>Cancel</button>}
      </div>

      {errors.range && <p style={{ color: 'red' }}>{errors.range}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>From %</th>
            <th>To %</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((division) => (
            <tr key={division._id}>
              <td>{division.name}</td>
              <td>{division.from.toFixed(2)}</td>
              <td>{division.to.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(division)}>✏️</button>
                <button onClick={() => handleDelete(division._id, division.name)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={'←'}
        nextLabel={'→'}
        pageCount={pageCount}
        onPageChange={({ selected }) => {
          setCurrentPage(selected);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page'}
        pageLinkClassName={'page-link'}
        previousClassName={'page'}
        nextClassName={'page'}
        breakLabel={'...'}
      />
    </div>
  );
};

export default MarkGrade;
