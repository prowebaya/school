import React, { useState } from "react";

const AdmitCard = () => {
    const [formData, setFormData] = useState({
        examGroup: "Class 4 (Pass / Fail)",
        exam: "Final Exam (March -2025)",
        session: "2024-25",
        studentClass: "Class 1",
        section: "A",
      });
    
      const [filteredStudents, setFilteredStudents] = useState([]);
      const [searchClicked, setSearchClicked] = useState(false);
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [showReportCard, setShowReportCard] = useState(false);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSearch = () => {
        setSearchClicked(true);
        const filtered = students.filter(
          (student) =>
            student.studentClass === formData.studentClass &&
            student.section === formData.section &&
            student.exam === formData.exam &&
            student.session === formData.session
        );
        setFilteredStudents(filtered);
      };
    
      const handleCheckboxChange = (student) => {
        setSelectedStudent(student);
      };
    
      const openReportCard = () => {
        if (selectedStudent) {
          setShowReportCard(true);
        }
      };
    
      const handlePrint = () => {
        window.print();
      };
    
      const students = [
        { id: 1, admissionNo: "120036", name: "Ayan Desai", father: "Abhinand", dob: "10/15/2015", gender: "Male", category: "General", mobile: "9067875674", studentClass: "Class 1", section: "A", exam: "Final Exam (March -2025)", session: "2024-25" },
        { id: 2, admissionNo: "120045", name: "Riya Patel", father: "Sanjay Patel", dob: "07/22/2014", gender: "Female", category: "OBC", mobile: "9086754321", studentClass: "Class 2", section: "B", exam: "Weekly Test", session: "2024-25" },
        { id: 3, admissionNo: "120059", name: "Arjun Mehta", father: "Rajesh Mehta", dob: "05/30/2015", gender: "Male", category: "SC", mobile: "8756432109", studentClass: "Class 1", section: "A", exam: "Final Exam (March -2025)", session: "2024-25" },
        { id: 4, admissionNo: "120072", name: "Priya Sharma", father: "Amit Sharma", dob: "03/11/2013", gender: "Female", category: "General", mobile: "9823475612", studentClass: "Class 3", section: "C", exam: "Midterm Exam", session: "2025-26" },
        { id: 5, admissionNo: "120088", name: "Kabir Khan", father: "Junaid Khan", dob: "12/29/2014", gender: "Male", category: "OBC", mobile: "9123456789", studentClass: "Class 1", section: "A", exam: "Final Exam (March -2025)", session: "2024-25" },
      ];

  // Color scheme
  const colors = {
    primary: "#2c3e50",
    secondary: "#3498db",
    accent: "#e74c3c",
    background: "#f8f9fa",
    text: "#2c3e50",
  };

  // Styling object
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      fontFamily: "'Poppins', sans-serif",
    },
    header: {
      textAlign: "center",
      color: colors.primary,
      fontSize: "2rem",
      fontWeight: "600",
      marginBottom: "2rem",
      position: "relative",
      "&:after": {
        content: "''",
        position: "absolute",
        bottom: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60px",
        height: "4px",
        background: colors.secondary,
        borderRadius: "2px",
      },
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "1.5rem",
      padding: "2rem",
      background: colors.background,
      borderRadius: "12px",
      marginBottom: "2rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: colors.text,
      paddingLeft: "8px",
    },
    select: {
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid #e0e0e0`,
      fontSize: "1rem",
      backgroundColor: "#fff",
      transition: "all 0.3s ease",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1em",
      "&:focus": {
        outline: "none",
        borderColor: colors.secondary,
        boxShadow: `0 0 0 3px ${colors.secondary}20`,
      },
    },
    searchButton: {
      gridColumn: "1 / -1",
      padding: "1rem 2rem",
      background: `linear-gradient(135deg, ${colors.secondary}, #2980b9)`,
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.8rem",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 5px 15px ${colors.secondary}40`,
      },
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "12px",
      boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
      margin: "2rem 0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
    },
    tableHeader: {
      background: colors.primary,
      color: "white",
      padding: "1rem",
      textAlign: "left",
      fontWeight: "500",
      fontSize: "0.95rem",
    },
    tableRow: {
      borderBottom: "1px solid #f0f0f0",
      transition: "background 0.2s ease",
      "&:hover": {
        background: "#f8f9fa",
      },
      "&:nth-child(even)": {
        background: "#fafafa",
      },
    },
    tableCell: {
      padding: "1rem",
      fontSize: "0.95rem",
      color: colors.text,
    },
    genderBadge: (gender) => ({
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "500",
      background: gender === "Male" ? "#3498db20" : "#e91e6320",
      color: gender === "Male" ? colors.secondary : "#e91e63",
      display: "inline-block",
    }),
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(3px)",
      zIndex: 1000,
    },
    reportCard: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "2rem",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
      width: "90%",
      maxWidth: "500px",
      zIndex: 1001,
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
    },
    actionButton: (color) => ({
      padding: "0.8rem 1.5rem",
      background: color,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.3s ease",
      "&:hover": {
        opacity: 0.9,
        transform: "translateY(-1px)",
      },
    }),
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admit Card Generator</h2>

      {/* Search Criteria */}
      <div style={styles.formGrid}>
        {[
          { label: "Exam Group", name: "examGroup", options: ["Class 4 (Pass / Fail)", "Class 4 (GPA Based Grading)"] },
          { label: "Exam", name: "exam", options: ["Final Exam (March -2025)", "Weekly Test", "Monthly Test", "Midterm Exam"] },
          { label: "Session", name: "session", options: ["2024-25", "2025-26", "2026-27"] },
          { label: "Class", name: "studentClass", options: ["Class 1", "Class 2", "Class 3"] },
          { label: "Section", name: "section", options: ["A", "B", "C"] },
        ].map((field) => (
          <div key={field.name} style={styles.inputGroup}>
            <label style={styles.label}>{field.label} *</label>
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              style={styles.select}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={handleSearch} style={styles.searchButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search Students
        </button>
      </div>

      {/* Results Section */}
      {searchClicked && (
        <div>
          <h3 style={{ ...styles.header, fontSize: "1.5rem" }}>Student List</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}></th>
                  <th style={styles.tableHeader}>Admission No</th>
                  <th style={styles.tableHeader}>Student Name</th>
                  <th style={styles.tableHeader}>Father Name</th>
                  <th style={styles.tableHeader}>DOB</th>
                  <th style={styles.tableHeader}>Gender</th>
                  <th style={styles.tableHeader}>Category</th>
                  <th style={styles.tableHeader}>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(student)}
                        style={{
                          width: "20px",
                          height: "20px",
                          accentColor: colors.secondary,
                          cursor: "pointer",
                        }}
                      />
                    </td>
                    <td style={styles.tableCell}>{student.admissionNo}</td>
                    <td style={{ ...styles.tableCell, fontWeight: "600" }}>{student.name}</td>
                    <td style={styles.tableCell}>{student.father}</td>
                    <td style={styles.tableCell}>{student.dob}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.genderBadge(student.gender)}>
                        {student.gender}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{student.category}</td>
                    <td style={styles.tableCell}>{student.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          {selectedStudent && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                onClick={openReportCard}
                style={styles.actionButton(colors.secondary)}
              >
                📄 Generate Report Card
              </button>
            </div>
          )}
        </div>
      )}

      {/* Report Card Modal */}
      {showReportCard && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowReportCard(false)} />
          <div style={styles.reportCard}>
            <h3 style={{ marginBottom: "1.5rem", color: colors.primary }}>Student Report Card</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div>
                <p style={{ margin: "0.8rem 0" }}><strong>Name:</strong> {selectedStudent.name}</p>
                <p style={{ margin: "0.8rem 0" }}><strong>Admission No:</strong> {selectedStudent.admissionNo}</p>
                <p style={{ margin: "0.8rem 0" }}><strong>Father's Name:</strong> {selectedStudent.father}</p>
              </div>
              <div>
                <p style={{ margin: "0.8rem 0" }}><strong>Session:</strong> {selectedStudent.session}</p>
                <p style={{ margin: "0.8rem 0" }}><strong>Class:</strong> {selectedStudent.studentClass}</p>
                <p style={{ margin: "0.8rem 0" }}><strong>Section:</strong> {selectedStudent.section}</p>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={handlePrint}
                style={styles.actionButton(colors.secondary)}
              >
                🖨️ Print Report
              </button>
              <button
                onClick={() => setShowReportCard(false)}
                style={styles.actionButton(colors.accent)}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdmitCard;