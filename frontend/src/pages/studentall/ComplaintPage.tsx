import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { OnChangeValue, SelectInstance } from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { keyframes } from "styled-components";
import {
  fetchComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
} from "../../redux/FrontOffice/Enquiry/complaintActions";
import { RootState, AppDispatch } from "../../redux/store";

interface Option {
  value: string;
  label: string;
}

interface Complaint {
  _id: string;
  complaintType: string;
  source: string;
  complainantType: string;
  date: string;
  description: string;
  actionTaken: string;
  note: string;
  name?: string;
  phone?: string;
  school: string;
}

const complaintTypes: Option[] = [
  { value: "Hostel", label: "Hostel" },
  { value: "Front Office", label: "Front Office" },
  { value: "Teacher", label: "Teacher" },
  { value: "Transport", label: "Transport" },
  { value: "Study", label: "Study" },
  { value: "Fees", label: "Fees" },
  { value: "Sports", label: "Sports" },
];

const sources: Option[] = [
  { value: "Phone", label: "Phone" },
  { value: "Email", label: "Email" },
  { value: "In-Person", label: "In-Person" },
];

const complainantTypeOptions: Option[] = [
  { value: "Student", label: "Student" },
  { value: "Parent", label: "Parent" },
  { value: "Staff", label: "Staff" },
  { value: "Other", label: "Other" },
];

const actionTakenOptions: Option[] = [
  { value: "Assigned", label: "Assigned" },
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" },
];

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: clamp(1.8rem, 5vw, 2.2rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Subtitle = styled.h3`
  color: #34495e;
  font-size: clamp(1.4rem, 4vw, 1.6rem);
  font-weight: 500;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.3);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
  & > * {
    flex: 1;
    min-width: 140px;
    max-width: 180px;
  }
  @media (max-width: 768px) {
    & > * {
      min-width: 120px;
      max-width: 150px;
    }
  }
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    & > * {
      min-width: 100%;
      max-width: 100%;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 500;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  border-collapse: collapse;
  animation: ${fadeIn} 0.5s ease;
  table-layout: auto;
  min-width: 800px;
`;

const Th = styled.th`
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  padding: 0.8rem;
  font-size: clamp(0.9rem, 3vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.8rem;
  text-align: center;
  border-bottom: 1px solid #ecf0f1;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  color: #2c3e50;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 768px) {
    max-width: 100px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin: 0 0.3rem;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  animation: ${fadeIn} 0.3s ease;
  overflow: auto;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${scaleIn} 0.3s ease;
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: auto;
  @media (max-width: 600px) {
    width: 95%;
    padding: 1rem;
    max-width: 400px;
  }
  @media (max-width: 480px) {
    padding: 0.8rem;
    max-width: 350px;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: clamp(0.9rem, 3vw, 1rem);
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.6rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: clamp(0.85rem, 3vw, 0.95rem);
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const CancelButton = styled(Button)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  &:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
  }
`;

const ComplaintPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { complaints = [], loading, error: reduxError } = useSelector((state: RootState) => state.complaints);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const adminID = currentUser?._id;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newComplaint, setNewComplaint] = useState({
    complaintType: "",
    source: "",
    complainantType: "Student",
    date: new Date().toISOString().split("T")[0],
    description: "",
    actionTaken: "Pending",
    note: "",
    name: "",
    phone: "",
  });

  const [filters, setFilters] = useState({
    complaintType: "",
    source: "",
    complainantType: "",
    date: "",
    actionTaken: "",
  });

  const inputRefs = {
    complaintType: useRef<SelectInstance<Option>>(null),
    source: useRef<SelectInstance<Option>>(null),
    complainantType: useRef<SelectInstance<Option>>(null),
    date: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    actionTaken: useRef<SelectInstance<Option>>(null),
    note: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (adminID) {
      dispatch(fetchComplaints(adminID));
    } else {
      setError("Please log in to view complaints");
      toast.error("Please log in to view complaints", { position: "top-right", autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (showForm && inputRefs.complaintType.current) {
      inputRefs.complaintType.current.focus();
    }
  }, [showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComplaint({ ...newComplaint, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (fieldName: string, newValue: OnChangeValue<Option, false>) => {
    setFilters((prev) => ({
      ...prev,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };

  const handleSelectChange = (
    fieldName: keyof typeof newComplaint,
    newValue: OnChangeValue<Option, false>,
    nextField?: keyof typeof inputRefs
  ) => {
    setNewComplaint((prev) => ({
      ...prev,
      [fieldName]: newValue ? newValue.value : "",
    }));

    if (nextField && inputRefs[nextField].current) {
      setTimeout(() => {
        const nextInput = inputRefs[nextField].current;
        nextInput?.focus();
        if ("openMenu" in nextInput) nextInput.openMenu?.();
      }, 100);
    }
  };

  const handleSelectKeyDown = (
    e: React.KeyboardEvent,
    fieldName: keyof typeof newComplaint,
    nextField?: keyof typeof inputRefs
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selectInstance = inputRefs[fieldName].current;
      if (selectInstance) {
        const highlightedOption = selectInstance.getFocusedOption() || selectInstance.getValue()[0];
        if (highlightedOption) {
          setNewComplaint((prev) => ({
            ...prev,
            [fieldName]: highlightedOption.value,
          }));
          selectInstance.closeMenu();
          if (nextField && inputRefs[nextField].current) {
            const nextInput = inputRefs[nextField].current;
            nextInput?.focus();
            if ("openMenu" in nextInput) nextInput.openMenu?.();
          }
        }
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    nextField?: keyof typeof inputRefs
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField && inputRefs[nextField].current) {
        const nextInput = inputRefs[nextField].current;
        nextInput?.focus();
        if ("openMenu" in nextInput) nextInput.openMenu?.();
      } else {
        handleSubmit(e as React.FormEvent);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setError("Please log in to submit complaints");
      toast.error("Please log in to submit complaints", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!newComplaint.complaintType || !newComplaint.complainantType || !newComplaint.date) {
      setError("Complaint Type, Complainant Type, and Date are required");
      toast.error("Complaint Type, Complainant Type, and Date are required", { position: "top-right", autoClose: 3000 });
      return;
    }

    const isValidDate = (dateStr: string) => !isNaN(new Date(dateStr).getTime());
    if (!isValidDate(newComplaint.date)) {
      setError("Invalid date format");
      toast.error("Invalid date format", { position: "top-right", autoClose: 3000 });
      return;
    }

    const complaintData = {
      ...newComplaint,
      date: new Date(newComplaint.date).toISOString(),
    };

    if (editingId !== null) {
      dispatch(updateComplaint(editingId, complaintData, adminID));
      toast.success("Complaint updated successfully!", { position: "top-right", autoClose: 3000 });
      setEditingId(null);
    } else {
      dispatch(addComplaint(complaintData, adminID));
      toast.success("Complaint added successfully!", { position: "top-right", autoClose: 3000 });
    }

    setNewComplaint({
      complaintType: "",
      source: "",
      complainantType: "Student",
      date: new Date().toISOString().split("T")[0],
      description: "",
      actionTaken: "Pending",
      note: "",
      name: "",
      phone: "",
    });
    setShowForm(false);
    setError(null);
  };

  const handleEdit = (id: string) => {
    const complaint = complaints.find((c: Complaint) => c._id === id);
    if (complaint) {
      setNewComplaint({
        complaintType: complaint.complaintType || "",
        source: complaint.source || "",
        complainantType: complaint.complainantType || "Student",
        date: complaint.date ? new Date(complaint.date).toISOString().split("T")[0] : "",
        description: complaint.description || "",
        actionTaken: complaint.actionTaken || "Pending",
        note: complaint.note || "",
        name: complaint.name || "",
        phone: complaint.phone || "",
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteComplaint(id, adminID));
    toast.success("Complaint deleted successfully!", { position: "top-right", autoClose: 3000 });
  };

  const handlePhoneInquiry = (phone: string) => {
    if (phone) {
      alert(`Calling ${phone}... 📞`);
    } else {
      toast.error("No phone number provided", { position: "top-right", autoClose: 3000 });
    }
  };

  const filteredComplaints = complaints.filter((complaint: Complaint) => {
    const matchesComplaintType = filters.complaintType ? complaint.complaintType === filters.complaintType : true;
    const matchesSource = filters.source ? complaint.source === filters.source : true;
    const matchesComplainantType = filters.complainantType ? complaint.complainantType === filters.complainantType : true;
    const matchesDate = filters.date ? new Date(complaint.date).toISOString().split("T")[0] === filters.date : true;
    const matchesActionTaken = filters.actionTaken ? complaint.actionTaken === filters.actionTaken : true;
    return matchesComplaintType && matchesSource && matchesComplainantType && matchesDate && matchesActionTaken;
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{
            borderRadius: "8px",
            fontFamily: "Roboto, sans-serif",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Title>Complaint Management</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {reduxError && <ErrorMessage>{reduxError}</ErrorMessage>}

        <FilterContainer>
          <Select
            options={complaintTypes}
            value={complaintTypes.find((opt) => opt.value === filters.complaintType) || null}
            onChange={(newValue) => handleFilterChange("complaintType", newValue)}
            placeholder="Complaint Type"
            isClearable
            isSearchable
            aria-label="Filter by Complaint Type"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "0.2rem",
                boxShadow: "none",
                "&:hover": { borderColor: "#3498db" },
                minWidth: "100%",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "6px",
                marginTop: "4px",
                zIndex: 1000,
              }),
            }}
          />
          <Select
            options={sources}
            value={sources.find((opt) => opt.value === filters.source) || null}
            onChange={(newValue) => handleFilterChange("source", newValue)}
            placeholder="Source"
            isClearable
            isSearchable
            aria-label="Filter by Source"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "0.2rem",
                boxShadow: "none",
                "&:hover": { borderColor: "#3498db" },
                minWidth: "100%",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "6px",
                marginTop: "4px",
                zIndex: 1000,
              }),
            }}
          />
          <Select
            options={complainantTypeOptions}
            value={complainantTypeOptions.find((opt) => opt.value === filters.complainantType) || null}
            onChange={(newValue) => handleFilterChange("complainantType", newValue)}
            placeholder="Complainant Type"
            isClearable
            isSearchable
            aria-label="Filter by Complainant Type"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "0.2rem",
                boxShadow: "none",
                "&:hover": { borderColor: "#3498db" },
                minWidth: "100%",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "6px",
                marginTop: "4px",
                zIndex: 1000,
              }),
            }}
          />
          <div>
            <Label htmlFor="filter-date">Date</Label>
            <Input
              id="filter-date"
              type="date"
              name="date"
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
              aria-label="Filter by Date"
            />
          </div>
          <Select
            options={actionTakenOptions}
            value={actionTakenOptions.find((opt) => opt.value === filters.actionTaken) || null}
            onChange={(newValue) => handleFilterChange("actionTaken", newValue)}
            placeholder="Status"
            isClearable
            isSearchable
            aria-label="Filter by Status"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "0.2rem",
                boxShadow: "none",
                "&:hover": { borderColor: "#3498db" },
                minWidth: "100%",
              }),
              menu: (base) => ({
                ...base,
                borderRadius: "6px",
                marginTop: "4px",
                zIndex: 1000,
              }),
            }}
          />
        </FilterContainer>

        <HeaderSection>
          <Subtitle>Complaint Details</Subtitle>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setNewComplaint({
                complaintType: "",
                source: "",
                complainantType: "Student",
                date: new Date().toISOString().split("T")[0],
                description: "",
                actionTaken: "Pending",
                note: "",
                name: "",
                phone: "",
              });
            }}
            aria-label="Add New Complaint"
          >
            + Add Complaint
          </Button>
        </HeaderSection>

        {loading ? (
          <ErrorMessage>Loading...</ErrorMessage>
        ) : complaints.length === 0 ? (
          <ErrorMessage>No complaints available</ErrorMessage>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Complaint Type</Th>
                  <Th>Source</Th>
                  <Th>Complainant Type</Th>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint: Complaint) => (
                    <tr key={complaint._id}>
                      <Td>{complaint.complaintType}</Td>
                      <Td>{complaint.source}</Td>
                      <Td>{complaint.complainantType}</Td>
                      <Td>{complaint.name}</Td>
                      <Td>{complaint.phone}</Td>
                      <Td>{new Date(complaint.date).toLocaleDateString()}</Td>
                      <Td>{complaint.actionTaken}</Td>
                      <Td>
                        <ActionButton
                          onClick={() => handleEdit(complaint._id)}
                          aria-label={`Edit complaint ${complaint._id}`}
                          style={{ color: "#3498db" }}
                        >
                          📝
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(complaint._id)}
                          aria-label={`Delete complaint ${complaint._id}`}
                          style={{ color: "#e74c3c" }}
                        >
                          ❌
                        </ActionButton>
                        <ActionButton
                          onClick={() => handlePhoneInquiry(complaint.phone || "")}
                          aria-label={`Call ${complaint.phone || "unknown"}`}
                          style={{ color: "#2ecc71" }}
                        >
                          📞
                        </ActionButton>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan={8}>No complaints available</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        )}

        {showForm && (
          <>
            <ModalOverlay onClick={() => setShowForm(false)} aria-label="Close modal" />
            <Modal role="dialog" aria-labelledby="complaint-form-title">
              <h3 id="complaint-form-title">{editingId !== null ? "Edit Complaint" : "Add Complaint"}</h3>
              <FormContainer onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="complaintType">Complaint Type</Label>
                  <Select
                    id="complaintType"
                    ref={inputRefs.complaintType}
                    options={complaintTypes}
                    value={complaintTypes.find((opt) => opt.value === newComplaint.complaintType) || null}
                    onChange={(newValue) => handleSelectChange("complaintType", newValue, "source")}
                    onKeyDown={(e) => handleSelectKeyDown(e, "complaintType", "source")}
                    placeholder="Select Complaint Type"
                    isClearable
                    isSearchable
                    aria-label="Complaint Type"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        padding: "0.2rem",
                        minWidth: "100%",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        marginTop: "4px",
                        zIndex: 1000,
                      }),
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    id="source"
                    ref={inputRefs.source}
                    options={sources}
                    value={sources.find((opt) => opt.value === newComplaint.source) || null}
                    onChange={(newValue) => handleSelectChange("source", newValue, "complainantType")}
                    onKeyDown={(e) => handleSelectKeyDown(e, "source", "complainantType")}
                    placeholder="Select Source"
                    isClearable
                    isSearchable
                    aria-label="Source"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        padding: "0.2rem",
                        minWidth: "100%",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        marginTop: "4px",
                        zIndex: 1000,
                      }),
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="complainantType">Complainant Type</Label>
                  <Select
                    id="complainantType"
                    ref={inputRefs.complaintType}
                    options={complainantTypeOptions}
                    value={complainantTypeOptions.find((opt) => opt.value === newComplaint.complaintType) || null}
                    onChange={(newValue) => handleSelectChange("complainantType", newValue, "date")}
                    onKeyDown={(e) => handleSelectKeyDown(e, "complainantType", "date")}
                    placeholder="Select Complainant Type"
                    isClearable
                    isSearchable
                    aria-label="Complainant Type"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        padding: "0.2rem",
                        minWidth: "100%",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        marginTop: "4px",
                        zIndex: 1000,
                      }),
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    value={newComplaint.date}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "description")}
                    ref={inputRefs.date}
                    required
                    aria-label="Complaint Date"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newComplaint.description}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "actionTaken")}
                    ref={inputRefs.description}
                    aria-label="Complaint Description"
                  />
                </div>
                <div>
                  <Label htmlFor="actionTaken">Action Taken</Label>
                  <Select
                    id="actionTaken"
                    ref={inputRefs.actionTaken}
                    options={actionTakenOptions}
                    value={actionTakenOptions.find((opt) => opt.value === newComplaint.actionTaken) || null}
                    onChange={(newValue) => handleSelectChange("actionTaken", newValue, "note")}
                    onKeyDown={(e) => handleSelectKeyDown(e, "actionTaken", "note")}
                    placeholder="Select Action Taken"
                    isClearable
                    isSearchable
                    aria-label="Action Taken"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        padding: "0.2rem",
                        minWidth: "100%",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "6px",
                        marginTop: "4px",
                        zIndex: 1000,
                      }),
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    type="text"
                    name="note"
                    value={newComplaint.note}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "name")}
                    ref={inputRefs.note}
                    aria-label="Note"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={newComplaint.name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, "phone")}
                    ref={inputRefs.name}
                    aria-label="Complainant Name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="text"
                    name="phone"
                    value={newComplaint.phone}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e)}
                    ref={inputRefs.phone}
                    aria-label="Complainant Phone"
                  />
                </div>
                <ButtonGroup>
                  <Button type="submit" aria-label="Save Complaint">
                    Save
                  </Button>
                  <CancelButton type="button" onClick={() => setShowForm(false)} aria-label="Cancel">
                    Cancel
                  </CancelButton>
                </ButtonGroup>
              </FormContainer>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default ComplaintPage;