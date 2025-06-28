import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For linking to a new page

const ClassTimetable = () => {
  // Sample timetable data for different classes and sections
  const timetableData = {
    "Class 1": {
      "A": {
        Monday: [
          { subject: "English (210)", time: "9:00 AM - 09:40 AM", teacher: "Shivam Verma (9002)", room: "120" },
          { subject: "Mathematics (110)", time: "09:40 AM - 10:20 AM", teacher: "Jason Sharton (90006)", room: "120" },
          { subject: "Hindi (230)", time: "10:20 AM - 11:00 AM", teacher: "Shivam Verma (9002)", room: "120" },
        ],
        Tuesday: [
          { subject: "English (210)", time: "9:00 AM - 09:40 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "Hindi (230)", time: "10:20 AM - 11:00 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "Mathematics (110)", time: "11:30 AM - 12:10 PM", teacher: "Shivam Verma (9002)", room: "110" },
        ],
        Wednesday: [
          { subject: "Hindi (230)", time: "9:00 AM - 09:40 AM", teacher: "Shivam Verma (9002)", room: "110" },
          { subject: "Computer (0020)", time: "09:40 AM - 10:20 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "English (210)", time: "10:20 AM - 11:00 AM", teacher: "Shivam Verma (9002)", room: "110" },
        ],
        Thursday: [
          { subject: "English (210)", time: "9:40 AM - 10:20 AM", teacher: "Shivam Verma (9002)", room: "110" },
          { subject: "Mathematics (110)", time: "10:20 AM - 11:00 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "Hindi (230)", time: "11:30 AM - 12:10 PM", teacher: "Shivam Verma (9002)", room: "110" },
        ],
        Friday: [
          { subject: "Hindi (230)", time: "9:00 AM - 09:40 AM", teacher: "Shivam Verma (9002)", room: "110" },
          { subject: "English (210)", time: "09:40 AM - 10:20 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "Mathematics (110)", time: "10:20 AM - 11:00 AM", teacher: "Shivam Verma (9002)", room: "110" },
        ],
        Saturday: [
          { subject: "English (210)", time: "9:00 AM - 09:40 AM", teacher: "Jason Sharton (90006)", room: "110" },
          { subject: "Mathematics (110)", time: "09:40 AM - 10:20 AM", teacher: "Shivam Verma (9002)", room: "110" },
          { subject: "Hindi (230)", time: "10:20 AM - 11:00 AM", teacher: "Jason Sharton (90006)", room: "110" },
        ],
        Sunday: [],
      },
    },
    "Class 2": {
      "A": {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      },
    },
  };

  // State for selected class, section, and whether to show the timetable
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [showTimetable, setShowTimetable] = useState(false);

  // Handle class and section selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection(""); // Reset section when class changes
    setShowTimetable(false); // Hide timetable when class changes
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setShowTimetable(false); // Hide timetable when section changes
  };

  // Handle search button click
  const handleSearch = () => {
    if (selectedClass && selectedSection) {
      setShowTimetable(true);
    }
  };

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="class-timetable-container">
      <style>
        {`
          .class-timetable-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg,rgb(235, 189, 89), #cfdef3);
            min-height: 100vh;
          }

          h2 {
            color: #2c3e50;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .criteria-selection {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
          }

          .criteria-selection label {
            font-size: 16px;
            color: #34495e;
            margin-right: 10px;
            font-weight: 600;
          }

          .criteria-selection select {
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 5px;
            transition: border-color 0.3s ease;
          }

          .criteria-selection select:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
          }

          .search-btn {
            background: #3498db;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .search-btn:hover {
            background: #2980b9;
          }

          .add-btn {
            background: #27ae60;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            transition: background 0.3s ease;
          }

          .add-btn:hover {
            background: #219653;
          }

          .timetable {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
          }

          .day-column {
            flex: 1;
            min-width: 180px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            transition: transform 0.3s ease;
          }

          .day-column:hover {
            transform: translateY(-5px);
          }

          .day-column h3 {
            color: #2c3e50;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            text-transform: uppercase;
          }

          .schedule-card {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #3498db;
            transition: background 0.3s ease;
          }

          .schedule-card:hover {
            background: #e9ecef;
          }

          .schedule-card p {
            margin: 5px 0;
            font-size: 14px;
            color: #34495e;
          }

          .schedule-card .subject {
            color: #27ae60;
            font-weight: bold;
          }

          .schedule-card .time {
            font-size: 13px;
            color: #7f8c8d;
          }

          .schedule-card .teacher {
            font-size: 13px;
            color: #7f8c8d;
          }

          .schedule-card .room {
            font-size: 13px;
            color: #7f8c8d;
          }

          .not-scheduled {
            color: #e74c3c;
            font-weight: bold;
            text-align: center;
            padding: 10px;
          }

          @media (max-width: 768px) {
            .timetable {
              flex-direction: column;
            }

            .day-column {
              min-width: 100%;
            }

            .criteria-selection {
              flex-direction: column;
              align-items: flex-start;
            }

            .criteria-selection select {
              width: 100%;
              margin-bottom: 10px;
            }

            .search-btn, .add-btn {
              width: 100%;
            }
          }
        `}
      </style>

      {/* Criteria Selection */}
      <h2>Select Criteria</h2>
      <div className="criteria-selection">
        <div>
          <label>Class <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">Select</option>
            {Object.keys(timetableData).map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Section <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedSection} onChange={handleSectionChange} disabled={!selectedClass}>
            <option value="">Select</option>
            {selectedClass &&
              Object.keys(timetableData[selectedClass]).map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
          </select>
        </div>
        <button className="search-btn" onClick={handleSearch}>Search</button>
        <Link to="/add-schedule" className="add-btn">Add</Link>
      </div>

      {/* Timetable Display */}
      {showTimetable && selectedClass && selectedSection && (
        <div className="timetable">
          {days.map((day) => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              {timetableData[selectedClass][selectedSection][day].length > 0 ? (
                timetableData[selectedClass][selectedSection][day].map((schedule, index) => (
                  <div key={index} className="schedule-card">
                    <p className="subject">Subject: {schedule.subject}</p>
                    <p className="time">{schedule.time}</p>
                    <p className="teacher">{schedule.teacher}</p>
                    <p className="room">Room No.: {schedule.room}</p>
                  </div>
                ))
              ) : (
                <div className="not-scheduled">Not Scheduled</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassTimetable;