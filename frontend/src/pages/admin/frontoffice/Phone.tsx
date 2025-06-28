import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchCallLogs,
  addCallLog,
  updateCallLog,
  deleteCallLog,
} from "../../../redux/FrontOffice/Enquiry/phoneHandler";
import { RootState, AppDispatch } from "../../../redux/store";

interface CallLog {
  _id: string;
  name: string;
  phone: string;
  date: string;
  description: string;
  followUpDate: string;
  duration: string;
  note: string;
  callType: "Incoming" | "Outgoing";
  school: string;
}

const PhoneCallLogPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { callLogs = [], loading, error: reduxError } = useSelector((state: RootState) => state.phoneCallLogs || {});
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const adminID = currentUser?._id;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    followUpDate: "",
    duration: "",
    note: "",
    callType: "Incoming" as "Incoming" | "Outgoing",
  });

  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    date: "",
  });

  // Refs for form inputs
  const inputRefs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    followUpDate: useRef<HTMLInputElement>(null),
    duration: useRef<HTMLInputElement>(null),
    note: useRef<HTMLTextAreaElement>(null),
    callTypeIncoming: useRef<HTMLInputElement>(null),
    callTypeOutgoing: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (adminID) {
      console.log("Fetching call logs for admin:", adminID);
      dispatch(fetchCallLogs(adminID));
    } else {
      setError("Please log in to view call logs");
      toast.error("Please log in to view call logs", { position: "top-right", autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  // Focus the first field when the form opens
  useEffect(() => {
    if (showForm && inputRefs.name.current) {
      inputRefs.name.current.focus();
    }
  }, [showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, callType: e.target.value as "Incoming" | "Outgoing" });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    nextField?: keyof typeof inputRefs
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField && inputRefs[nextField].current) {
        inputRefs[nextField].current.focus();
      } else {
        handleSubmit(e as React.FormEvent);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminID) {
      setError("Please log in to submit call logs");
      toast.error("Please log in to submit call logs", { position: "top-right", autoClose: 3000 });
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      toast.error("Name is required", { position: "top-right", autoClose: 3000 });
      return;
    }

    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (!cleanedPhone) {
      setError("Phone number is required");
      toast.error("Phone number is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit phone number");
      toast.error("Please enter a valid 10-digit phone number", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!formData.date) {
      setError("Date is required");
      toast.error("Date is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    const isValidDate = (dateStr: string) => !isNaN(new Date(dateStr).getTime());
    if (!isValidDate(formData.date)) {
      setError("Invalid date format");
      toast.error("Invalid date format", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!formData.followUpDate) {
      setError("Follow-up date is required");
      toast.error("Follow-up date is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!isValidDate(formData.followUpDate)) {
      setError("Invalid follow-up date format");
      toast.error("Invalid follow-up date format", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      toast.error("Description is required", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!formData.duration.trim()) {
      setError("Duration is required");
      toast.error("Duration is required", { position: "top-right", autoClose: 3000 });
      return;
    }
    const durationRegex = /^\d+\s*(min|sec)$/i;
    if (!durationRegex.test(formData.duration.trim())) {
      setError("Duration must be a number followed by 'min' or 'sec' (e.g., '5 min')");
      toast.error("Duration must be a number followed by 'min' or 'sec' (e.g., '5 min')", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!formData.note.trim()) {
      setError("Note is required");
      toast.error("Note is required", { position: "top-right", autoClose: 3000 });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: cleanedPhone,
      date: new Date(formData.date).toISOString(),
      description: formData.description.trim(),
      followUpDate: new Date(formData.followUpDate).toISOString(),
      duration: formData.duration.trim(),
      note: formData.note.trim(),
      callType: formData.callType,
      adminID,
    };

    try {
      if (editingId) {
        await dispatch(updateCallLog({ id: editingId, log: payload, adminID }));
        toast.success("Call log updated successfully!", { position: "top-right", autoClose: 3000 });
        setEditingId(null);
      } else {
        await dispatch(addCallLog(payload));
        toast.success("Call log added successfully!", { position: "top-right", autoClose: 3000 });
      }

      setFormData({
        name: "",
        phone: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        followUpDate: "",
        duration: "",
        note: "",
        callType: "Incoming",
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      toast.error("Failed to save call log.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleEdit = (id: string) => {
    const callLog = callLogs.find((log: CallLog) => log._id === id);
    if (callLog) {
      setFormData({
        name: callLog.name || "",
        phone: callLog.phone || "",
        date: callLog.date ? new Date(callLog.date).toISOString().split("T")[0] : "",
        description: callLog.description || "",
        followUpDate: callLog.followUpDate ? new Date(callLog.followUpDate).toISOString().split("T")[0] : "",
        duration: callLog.duration || "",
        note: callLog.note || "",
        callType: callLog.callType || "Incoming",
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCallLog(id, adminID));
    toast.success("Call log deleted successfully!", { position: "top-right", autoClose: 3000 });
  };

  const filteredCallLogs = callLogs.filter((log: CallLog) => {
    const matchesName = filters.name ? log.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const matchesPhone = filters.phone ? log.phone.includes(filters.phone) : true;
    const matchesDate = filters.date ? new Date(log.date).toISOString().split("T")[0] === filters.date : true;
    return matchesName && matchesPhone && matchesDate;
  });

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Roboto', Arial, sans-serif",
        backgroundColor: "#e8f0f2",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 20px;
          margin-bottom: 20px;
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-container label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #455a64;
          margin-bottom: 4px;
        }
        .form-container input,
        .form-container textarea {
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #f5f5f5;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-container input:focus,
        .form-container textarea:focus {
          outline: none;
          border-color: #00796b;
          box-shadow: 0 0 5px rgba(0, 121, 107, 0.3);
        }
        .form-container textarea {
          resize: vertical;
          min-height: 80px;
        }
        .form-container .radio-group {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .form-container .radio-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
        }
        .filter-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }
        .filter-container input {
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #f5f5f5;
          width: 160px;
          transition: border-color 0.2s ease;
        }
        .filter-container input:focus {
          outline: none;
          border-color: #00796b;
        }
        .error {
          color: #d32f2f;
          text-align: center;
          font-size: 0.9rem;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .table-container {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .table th,
        .table td {
          padding: 12px;
          text-align: left;
          font-size: 0.9rem;
          border-bottom: 1px solid #e0e0e0;
        }
        .table th {
          background: #004d40;
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
        }
        .table tr {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .table tr:hover {
          background: #e0f2f1;
          transform: translateY(-1px);
        }
        .table-mobile {
          display: none;
        }
        .table-mobile .row {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 12px;
          margin-bottom: 12px;
        }
        .table-mobile .row div {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 0.85rem;
        }
        .table-mobile .row div:last-child {
          border-bottom: none;
        }
        .table-mobile .row div span:first-child {
          font-weight: 600;
          color: #455a64;
        }
        .button {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: none;
        }
        .button:hover {
          transform: scale(1.05);
        }
        .button-primary {
          background: #00796b;
          color: #fff;
        }
        .button-primary:hover {
          background: #004d40;
        }
        .button-danger {
          background: #d32f2f;
          color: #fff;
        }
        .button-danger:hover {
          background: #b71c1c;
        }
        .action-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 5px;
          transition: transform 0.2s ease;
        }
        .action-button:hover {
          transform: scale(1.2);
        }
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          padding: 24px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
          max-height: 90vh;
          border: 2px solid #00796b;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .Toastify__toast--success {
          background: linear-gradient(135deg, #00796b, #004d40);
          color: #fff;
          font-family: 'Roboto', Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 0.9rem;
        }
        .Toastify__toast--error {
          background: linear-gradient(135deg, #d32f2f, #b71c1c);
          color: #fff;
          font-family: 'Roboto', Arial, sans-serif;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 0.9rem;
        }
        .Toastify__toast-body {
          padding: 10px;
        }
        .Toastify__close-button {
          color: #fff;
          opacity: 0.8;
        }
        .Toastify__close-button:hover {
          opacity: 1;
        }
        .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 600px) {
          .table {
            display: none;
          }
          .table-mobile {
            display: block;
          }
          .filter-container input {
            width: 100%;
            max-width: 100%;
          }
          .modal {
            width: 95%;
            padding: 16px;
            max-height: 85vh;
            border: 1px solid #00796b;
          }
          .form-container label,
          .form-container input,
          .form-container textarea {
            font-size: 0.85rem;
          }
          .button {
            font-size: 0.85rem;
            padding: 8px 12px;
          }
          .modal h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <div className="container">
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

        <h2
          style={{
            textAlign: "center",
            color: "#004d40",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "24px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Phone Call Log Management
        </h2>

        {(error || reduxError) && (
          <div className="error">{error || reduxError}</div>
        )}

        {/* Filter Section */}
        <div className="card">
          <div className="filter-container">
            <input
              type="text"
              name="phone"
              placeholder="Filter by Phone"
              value={filters.phone}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                color: "#004d40",
                fontSize: "1.4rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Call Log Details
            </h3>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  name: "",
                  phone: "",
                  date: new Date().toISOString().split("T")[0],
                  description: "",
                  followUpDate: "",
                  duration: "",
                  note: "",
                  callType: "Incoming",
                });
              }}
              className="button button-primary"
            >
              + Add Call Log
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", fontSize: "1rem" }}>
              Loading...
            </div>
          ) : filteredCallLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#d32f2f", fontSize: "1rem" }}>
              No call logs available
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Date</th>
                      <th>Follow Up</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallLogs.map((log: CallLog) => (
                      <tr key={log._id}>
                        <td>{log.name}</td>
                        <td>{log.phone}</td>
                        <td>{new Date(log.date).toLocaleDateString()}</td>
                        <td>{log.followUpDate ? new Date(log.followUpDate).toLocaleDateString() : "N/A"}</td>
                        <td>{log.callType}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(log._id)}
                            className="action-button"
                            style={{ color: "#0288d1" }}
                            title="Edit"
                          >
                            📝
                          </button>
                          <button
                            onClick={() => handleDelete(log._id)}
                            className="action-button"
                            style={{ color: "#d32f2f" }}
                            title="Delete"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Table */}
              <div className="table-mobile">
                {filteredCallLogs.map((log: CallLog) => (
                  <div className="row" key={log._id}>
                    <div>
                      <span>Name:</span> <span>{log.name}</span>
                    </div>
                    <div>
                      <span>Phone:</span> <span>{log.phone}</span>
                    </div>
                    <div>
                      <span>Date:</span> <span>{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span>Follow Up:</span> <span>{log.followUpDate ? new Date(log.followUpDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div>
                      <span>Type:</span> <span>{log.callType}</span>
                    </div>
                    <div>
                      <span>Actions:</span>
                      <span>
                        <button
                          onClick={() => handleEdit(log._id)}
                          className="action-button"
                          style={{ color: "#0288d1" }}
                        >
                          📝
                        </button>
                        <button
                          onClick={() => handleDelete(log._id)}
                          className="action-button"
                          style={{ color: "#d32f2f" }}
                        >
                          ❌
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <>
            <div className="modal-overlay" onClick={() => setShowForm(false)} />
            <div className="modal">
              <h3
                style={{
                  color: "#004d40",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                {editingId !== null ? "Edit Call Log" : "Add Call Log"}
              </h3>
              {error && <div className="error">{error}</div>}
              <form onSubmit={handleSubmit} className="form-container">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "phone")}
                  ref={inputRefs.name}
                  required
                />
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "date")}
                  ref={inputRefs.phone}
                  required
                />
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "description")}
                  ref={inputRefs.date}
                  required
                />
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "followUpDate")}
                  ref={inputRefs.description}
                  required
                />
                <label>Follow Up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "duration")}
                  ref={inputRefs.followUpDate}
                  required
                />
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "note")}
                  ref={inputRefs.duration}
                  placeholder="e.g., 5 min"
                  required
                />
                <label>Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "callTypeIncoming")}
                  ref={inputRefs.note}
                  required
                />
                <label>Call Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="callType"
                      value="Incoming"
                      checked={formData.callType === "Incoming"}
                      onChange={handleRadioChange}
                      onKeyDown={(e) => handleKeyDown(e, "callTypeOutgoing")}
                      ref={inputRefs.callTypeIncoming}
                    />
                    Incoming
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="callType"
                      value="Outgoing"
                      checked={formData.callType === "Outgoing"}
                      onChange={handleRadioChange}
                      onKeyDown={(e) => handleKeyDown(e)}
                      ref={inputRefs.callTypeOutgoing}
                    />
                    Outgoing
                  </label>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                  <button type="submit" className="button button-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="button button-danger"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneCallLogPage;