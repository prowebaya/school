import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify'; // Added ToastContainer import
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import {
  fetchSubjectGroups,
  saveSubjectGroup,
  removeClassFromGroup,
  clearSubjectGroupError,
} from '../../../redux/subjectGroup/ubjectGroupActions';
import { RootState, AppDispatch } from '../../../redux/store';
import Select, { OnChangeValue } from 'react-select';

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background: linear-gradient(135deg, rgb(225, 192, 69), #cfdef3);
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  flex: 1;
  max-width: 400px;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ListSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  flex: 2;
  overflow-y: auto;
  max-height: 80vh;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #34495e;
  margin-bottom: 5px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
  }
`;

const SubjectCheckboxes = styled.div`
  margin: 15px 0;
  max-height: 200px;
  overflow-y: auto;
`;

const SaveButton = styled.button`
  background: linear-gradient(90deg, #3498db, #2980b9);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.1s ease;
  &:hover {
    background: linear-gradient(90deg, #2980b9, #3498db);
    transform: scale(1.05);
  }
`;

const Group = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const ClassEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

const Subjects = styled.div`
  margin-left: 20px;
  font-size: 14px;
  color: #7f8c8d;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  font-size: 18px;
  transition: color 0.3s ease;
  &.edit-btn:hover {
    color: #3498db;
  }
  &.delete-btn:hover {
    color: #e74c3c;
  }
`;

interface SubjectGroupData {
  _id: string;
  name: string;
  classes: Array<{
    class: string;
    section: string;
    subjects: string[];
  }>;
  admin: string;
}

interface Option {
  value: string;
  label: string;
}

interface Fclass {
  _id: string;
  name: string;
  sections: string[];
}

const SubjectGroup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subjectGroupsList, loading, error } = useSelector((state: RootState) => state.subjectGroup);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { fclassesList, error: fclassError } = useSelector((state: RootState) => state.fclass);
  const { sectionsList, error: sectionError } = useSelector((state: RootState) => state.sections);
  const adminID = currentUser?._id;

  // Hardcoded subjects (can be fetched dynamically if needed)
  const subjects = [
    "English", "Hindi", "Mathematics", "Science", "Social Studies",
    "French", "Drawing", "Computer", "Elective 1", "Elective 2", "Elective 3"
  ];

  // State for form inputs
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Fetch subject groups, classes, and sections on mount
  useEffect(() => {
    if (adminID) {
      dispatch(fetchSubjectGroups(adminID));
    } else {
      toast.error('Please log in to view subject groups', { position: 'top-right', autoClose: 3000 });
    }
  }, [dispatch, adminID]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
      dispatch(clearSubjectGroupError());
    }
    if (fclassError) {
      toast.error(`Failed to load classes: ${fclassError}`, { position: 'top-right', autoClose: 3000 });
    }
    if (sectionError) {
      toast.error(`Failed to load sections: ${sectionError}`, { position: 'top-right', autoClose: 3000 });
    }
  }, [error, fclassError, sectionError, dispatch]);

  // Class and section options
  const classOptions: Option[] = fclassesList.map((cls: Fclass) => ({
    value: cls._id,
    label: cls.name,
  }));

  const sectionOptions: Option[] = fclassesList
    .find((cls: Fclass) => cls._id === selectedClass)
    ?.sections.map((sec: string) => ({ value: sec, label: sec })) || [];

  // Handle subject checkbox selection
  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  // Handle class selection
  const handleClassChange = (newValue: OnChangeValue<Option, false>) => {
    setSelectedClass(newValue ? newValue.value : null);
    setSelectedSection(null); // Reset section when class changes
  };

  // Handle section selection
  const handleSectionChange = (newValue: OnChangeValue<Option, false>) => {
    setSelectedSection(newValue ? newValue.value : null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedClass && selectedSection && selectedSubjects.length > 0 && adminID) {
      // Validate section against selected class
      const selectedClassData = fclassesList.find((cls: Fclass) => cls._id === selectedClass);
      if (selectedClassData && !selectedClassData.sections.includes(selectedSection)) {
        toast.error('Invalid section for selected class', { position: 'top-right', autoClose: 3000 });
        return;
      }

      try {
        await dispatch(
          saveSubjectGroup(
            {
              name,
              class: selectedClassData.name, // Send class name instead of ID
              section: selectedSection,
              subjects: selectedSubjects,
            },
            adminID
          )
        );
        toast.success('Subject group saved successfully', { position: 'top-right', autoClose: 3000 });
        // Reset form
        setName('');
        setSelectedClass(null);
        setSelectedSection(null);
        setSelectedSubjects([]);
        setEditingGroupId(null);
      } catch (error) {
        toast.error('Failed to save subject group', { position: 'top-right', autoClose: 3000 });
      }
    } else {
      toast.error('Please fill in all required fields and select at least one subject.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Handle edit
  const handleEdit = (groupId: string, classIndex: number) => {
    const group = subjectGroupsList.find((g: SubjectGroupData) => g._id === groupId);
    if (group) {
      const classData = group.classes[classIndex];
      const selectedClassData = fclassesList.find((cls: Fclass) => cls.name === classData.class);
      setName(group.name);
      setSelectedClass(selectedClassData?._id || null);
      setSelectedSection(classData.section);
      setSelectedSubjects(classData.subjects);
      setEditingGroupId(groupId);
      // Remove the class entry so it can be re-added after editing
      handleDelete(groupId, classIndex);
    }
  };

  // Handle delete
  const handleDelete = async (groupId: string, classIndex: number) => {
    try {
      await dispatch(removeClassFromGroup(groupId, classIndex, adminID));
      toast.success('Class removed successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to remove class', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <Container>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{
            borderRadius: '8px',
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        />
        {loading && <div>Loading...</div>}
        {(error || fclassError || sectionError) && (
          <div style={{ color: '#e74c3c', textAlign: 'center' }}>
            {error || fclassError || sectionError}
          </div>
        )}

        <FormSection>
          <Title>Add Subject Group</Title>
          <form onSubmit={handleSubmit}>
            <Label>Name <span style={{ color: 'red' }}>*</span></Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
            />

            <Label>Class <span style={{ color: 'red' }}>*</span></Label>
            <Select
              options={classOptions}
              value={classOptions.find((opt) => opt.value === selectedClass) || null}
              onChange={handleClassChange}
              placeholder="Select Class"
              isClearable
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '5px',
                  padding: '5px',
                  marginBottom: '10px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '5px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />

            <Label>Section <span style={{ color: 'red' }}>*</span></Label>
            <Select
              options={sectionOptions}
              value={sectionOptions.find((opt) => opt.value === selectedSection) || null}
              onChange={handleSectionChange}
              placeholder="Select Section"
              isClearable
              isSearchable
              isDisabled={!selectedClass}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '5px',
                  padding: '5px',
                  marginBottom: '10px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '5px',
                  marginTop: '4px',
                  zIndex: 1000,
                }),
              }}
            />

            <Label>Subject <span style={{ color: 'red' }}>*</span></Label>
            <SubjectCheckboxes>
              {subjects.map((subject) => (
                <Label key={subject}>
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectChange(subject)}
                  />
                  {subject}
                </Label>
              ))}
            </SubjectCheckboxes>

            <SaveButton type="submit">Save</SaveButton>
          </form>
        </FormSection>

        <ListSection>
          <Title>Subject Group List</Title>
          {subjectGroupsList.map((group: SubjectGroupData, groupIndex: number) => (
            <Group key={group._id}>
              <h3>{group.name}</h3>
              {group.classes.map((classData, classIndex) => (
                <ClassEntry key={classIndex}>
                  <div>
                    <span>Class (Section): {classData.class} ({classData.section})</span>
                    <Subjects>
                      {classData.subjects.map((subject, subjectIndex) => (
                        <span key={subjectIndex}>
                          {subjectIndex + 1}. {subject}
                          {subjectIndex < classData.subjects.length - 1 && ', '}
                        </span>
                      ))}
                    </Subjects>
                  </div>
                  <div>
                    <ActionButton
                      className="edit-btn"
                      onClick={() => handleEdit(group._id, classIndex)}
                      title="Edit"
                    >
                      ✏️
                    </ActionButton>
                    <ActionButton
                      className="delete-btn"
                      onClick={() => handleDelete(group._id, classIndex)}
                      title="Delete"
                    >
                      ❌
                    </ActionButton>
                  </div>
                </ClassEntry>
              ))}
            </Group>
          ))}
        </ListSection>
      </Container>
    </>
  );
};

export default SubjectGroup;