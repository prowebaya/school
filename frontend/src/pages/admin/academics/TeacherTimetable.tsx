// components/TeacherTimetable.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Select, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getTeacherTimetable, addAttendance, addTimetable, clearTimetableError } from '../../../redux/Timetable/timetableSlice';
import { fetchTeachers } from '../../../redux/TeacherAllRelated/teacherManageActions';
import { RootState } from '../../../redux/store';

interface TimetableForm {
  className: string;
  section: string;
  subject: string;
  day: string;
  time: string;
  room: string;
}

interface Teacher {
  _id: string;
  fullName: string;
  teacherId: string;
}

interface TimetableEntry {
  class: string;
  section: string;
  subject: string;
  time: string;
  room: string;
  _id: string;
}

const TeacherTimetable: React.FC = () => {
  const dispatch = useDispatch();
  const { teachers, loading: teacherLoading, error: teacherError } = useSelector((state: RootState) => state.teacherManage || { teachers: [], loading: false, error: null });
  const { timetable, loading: timetableLoading, error: timetableError } = useSelector((state: RootState) => state.timetable || { timetable: {}, loading: false, error: null });
  const { currentUser } = useSelector((state: RootState) => state.user || { currentUser: null });
  const adminID = currentUser?._id;

  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [showTimetable, setShowTimetable] = useState<boolean>(false);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: string }>({});
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [timetableForm, setTimetableForm] = useState<TimetableForm>({
    className: '',
    section: '',
    subject: '',
    day: '',
    time: '',
    room: '',
  });

  const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    console.log('Current user:', currentUser);
    console.log('adminID:', adminID);
    if (adminID) {
      console.log('Fetching teachers with adminID:', adminID);
      dispatch(fetchTeachers(adminID));
    } else {
      toast.error('Please log in to view teachers', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    console.log('Teachers:', teachers);
    if (timetableError) {
      toast.error(timetableError, { position: 'top-right', autoClose: 3000 });
      dispatch(clearTimetableError());
    }
    if (teacherError) {
      toast.error(`Failed to load teachers: ${teacherError}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [timetableError, teacherError, teachers, dispatch]);

  const handleTeacherChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTeacher(e.target.value as string);
    setShowTimetable(false);
    setAttendanceStatus({});
    console.log('Selected teacher:', e.target.value);
  };

  const handleSearch = () => {
    if (selectedTeacher && adminID) {
      console.log('Searching timetable for adminID:', adminID, 'teacherId:', selectedTeacher);
      dispatch(getTeacherTimetable({ adminID, teacherId: selectedTeacher }));
      setShowTimetable(true);
    } else {
      toast.error('Please select a teacher and ensure you are logged in', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleAttendanceChange = (timetableId: string, status: string) => {
    setAttendanceStatus((prev) => ({ ...prev, [timetableId]: status }));
  };

  const handleAddAttendance = (timetableId: string) => {
    if (!adminID) {
      toast.error('Please log in to add attendance', { position: 'top-right', autoClose: 3000 });
      return;
    }
    const status = attendanceStatus[timetableId];
    if (!status) {
      toast.error('Please select an attendance status', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(addAttendance({ adminID, timetableId, date: attendanceDate, status }))
      .unwrap()
      .then(() => {
        toast.success('Attendance added successfully', { position: 'top-right', autoClose: 3000 });
        setAttendanceStatus((prev) => ({ ...prev, [timetableId]: '' }));
      })
      .catch(() => {
        toast.error('Failed to add attendance', { position: 'top-right', autoClose: 3000 });
      });
  };

  const handleOpenAddForm = () => {
    if (!selectedTeacher) {
      toast.error('Please select a teacher first', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setOpenAddForm(true);
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
    setTimetableForm({
      className: '',
      section: '',
      subject: '',
      day: '',
      time: '',
      room: '',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setTimetableForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTimetable = () => {
    if (!adminID || !selectedTeacher) {
      toast.error('Please log in and select a teacher', { position: 'top-right', autoClose: 3000 });
      return;
    }
    const { className, section, subject, day, time, room } = timetableForm;
    if (!className || !section || !subject || !day || !time || !room) {
      toast.error('All fields are required', { position: 'top-right', autoClose: 3000 });
      return;
    }
    dispatch(addTimetable({
      adminID,
      teacherId: selectedTeacher,
      className,
      section,
      subject,
      day,
      time,
      room,
    }))
      .unwrap()
      .then(() => {
        toast.success('Timetable entry added successfully', { position: 'top-right', autoClose: 3000 });
        setOpenAddForm(false);
        setTimetableForm({
          className: '',
          section: '',
          subject: '',
          day: '',
          time: '',
          room: '',
        });
      })
      .catch(() => {
        toast.error('Failed to add timetable entry', { position: 'top-right', autoClose: 3000 });
      });
  };

  const teacherOptions: { _id: string; label: string }[] = teachers.map((teacher: Teacher) => ({
    _id: teacher._id,
    label: `${teacher.fullName} (${teacher.teacherId})`,
  }));

  return (
    <div className="teacher-timetable-container">
      <ToastContainer />
      <style>
        {`
          .teacher-timetable-container {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, rgb(234, 187, 79), #d9e2ec);
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

          .teacher-selection {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
          }

          .teacher-selection label {
            font-size: 16px;
            color: #34495e;
            margin-right: 10px;
            font-weight: 600;
          }

          .teacher-selection .MuiFormControl-root {
            min-width: 200px;
          }

          .search-btn, .add-timetable-btn {
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

          .search-btn:hover, .add-timetable-btn:hover {
            background: #2980b9;
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

          .attendance-section {
            margin-top: 10px;
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .attendance-section .MuiFormControl-root {
            min-width: 120px;
          }

          .add-attendance-btn {
            background: #27ae60;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .add-attendance-btn:hover {
            background: #219653;
          }

          .form-field {
            margin-bottom: 15px;
            width: 100%;
          }

          @media (max-width: 768px) {
            .timetable {
              flex-direction: column;
            }

            .day-column {
              min-width: 100%;
            }

            .teacher-selection {
              flex-direction: column;
              align-items: flex-start;
            }

            .teacher-selection .MuiFormControl-root {
              width: 100%;
              margin-bottom: 10px;
            }

            .search-btn, .add-timetable-btn {
              width: 100%;
            }
          }
        `}
      </style>

      <h2>Teacher Time Table</h2>
      {teachers.length === 0 && !teacherLoading && (
        <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: '1rem' }}>
          No teachers available. Please add teachers first.
        </div>
      )}
      <div className="teacher-selection">
        <FormControl>
          <InputLabel>Teachers</InputLabel>
          <Select
            value={selectedTeacher}
            onChange={handleTeacherChange}
            label="Teachers"
            disabled={teacherLoading || !adminID}
          >
            <MenuItem value="">Select</MenuItem>
            {teacherOptions.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button className="search-btn" onClick={handleSearch} disabled={teacherLoading || !adminID}>
          Search
        </Button>
        <Button className="add-timetable-btn" onClick={handleOpenAddForm} disabled={teacherLoading || !adminID}>
          Add Timetable
        </Button>
      </div>

      <Dialog open={openAddForm} onClose={handleCloseAddForm}>
        <DialogTitle>Add Timetable Entry</DialogTitle>
        <DialogContent>
          <TextField
            className="form-field"
            label="Class (e.g., Class 1)"
            name="className"
            value={timetableForm.className}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            className="form-field"
            label="Section (e.g., A)"
            name="section"
            value={timetableForm.section}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            className="form-field"
            label="Subject (e.g., English)"
            name="subject"
            value={timetableForm.subject}
            onChange={handleFormChange}
            fullWidth
          />
          <FormControl className="form-field" fullWidth>
            <InputLabel>Day</InputLabel>
            <Select
              name="day"
              value={timetableForm.day}
              onChange={handleFormChange}
              label="Day"
            >
              <MenuItem value="">Select</MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="form-field"
            label="Time (e.g., 9:00 AM - 09:40 AM)"
            name="time"
            value={timetableForm.time}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            className="form-field"
            label="Room (e.g., 120)"
            name="room"
            value={timetableForm.room}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddForm}>Cancel</Button>
          <Button onClick={handleAddTimetable} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {showTimetable && selectedTeacher && (
        <div className="timetable">
          {days.map((day) => (
            <div key={day} className="day-column">
              <h3>{day}</h3>
              {timetable[day]?.length > 0 ? (
                timetable[day].map((schedule: TimetableEntry) => (
                  <div key={schedule._id} className="schedule-card">
                    <p>Class: {schedule.class} ({schedule.section})</p>
                    <p className="subject">Subject: {schedule.subject}</p>
                    <p className="time">{schedule.time}</p>
                    <p className="room">Room No.: {schedule.room}</p>
                    <div className="attendance-section">
                      <FormControl>
                        <InputLabel>Attendance</InputLabel>
                        <Select
                          value={attendanceStatus[schedule._id] || ''}
                          onChange={(e) => handleAttendanceChange(schedule._id, e.target.value as string)}
                          label="Attendance"
                          disabled={timetableLoading || !adminID}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="Present">Present</MenuItem>
                          <MenuItem value="Absent">Absent</MenuItem>
                          <MenuItem value="Leave">Leave</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        className="add-attendance-btn"
                        onClick={() => handleAddAttendance(schedule._id)}
                        disabled={timetableLoading || !adminID}
                      >
                        Add Attendance
                      </Button>
                    </div>
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

export default TeacherTimetable;