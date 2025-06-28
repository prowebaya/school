import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Collapse, List } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/PersonAdd';
import { ExpandLess, ExpandMore, SupervisorAccountOutlined as LibrarianIcon } from '@mui/icons-material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PrintIcon from '@mui/icons-material/Print';
import DescriptionIcon from '@mui/icons-material/Description';
import GradeIcon from '@mui/icons-material/Grade';
import CategoryIcon from '@mui/icons-material/Category';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
import ClassIcon from '@mui/icons-material/Class';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SubjectIcon from '@mui/icons-material/Subject';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import MenuBookIcon from '@mui/icons-material/MenuBook'; 
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommuteIcon from '@mui/icons-material/Commute';

import RoomIcon from '@mui/icons-material/Room';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import MapIcon from '@mui/icons-material/Map';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
// import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
// import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';






// Or from specific paths if using custom icons

const SideBar = () => {
    const location = useLocation();
    const [open, setOpen] = React.useState({ Fees: false, income: false,
        expenses: false, examinations: false, }); // Initialize with Fees key

    const handleToggle = (menu) => {
        setOpen((prev) => ({
            ...prev,
            [menu]: !prev[menu], // Toggle specific menu
        }));
    };
    const sidebarStyle = {
        height: '100vh',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #E8C897', // Dark gray thumb, light gold track
        backgroundColor: '#c8adf7', // Light gold background
        color: 'black', // Optional: Adjust text color for better readability
    };
    
    return (
        
        <List style={sidebarStyle}>
        
            <ListItemButton component={Link} to="/">
                <ListItemIcon>
                    <HomeIcon color={location.pathname === "/" ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>

            {/* Classes */}
            <ListItemButton onClick={() => handleToggle('classes')}>
                <ListItemIcon>
                    <ClassOutlinedIcon color={location.pathname.startsWith('/Admin/classes') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Front Office" />
                {open.classes ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.classes} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component={Link} to="/Admin/frontoffice/admissionenquiry" sx={{ pl: 4 }}>
                        <ListItemText primary="Addmission Enquiry" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/visitorlist" sx={{ pl: 4 }}>
                        <ListItemText primary="VisitorList" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/phone" sx={{ pl: 4 }}>
                        <ListItemText primary="Phone Call Log" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/postaldispatch" sx={{ pl: 4 }}>
                        <ListItemText primary="PostalDispatch" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/postalreceive" sx={{ pl: 4 }}>
                        <ListItemText primary="PostalReceive" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/complaintpage" sx={{ pl: 4 }}>
                        <ListItemText primary="ComplaintPage" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/frontoffice/frontoffice" sx={{ pl: 4 }}>
                        <ListItemText primary="FrontOffice" />
                    </ListItemButton>
                </List>
            </Collapse>

            {/* Subjects */}
            <ListItemButton onClick={() => handleToggle('Fees')}>
    <ListItemIcon>
        <AssignmentIcon color={location.pathname.startsWith("/Admin/subjects") ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Fees Collection" />
    {open.Fees ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={open.Fees} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton component={Link} to="/Admin/feerelated/collectfeepage" sx={{ pl: 4 }}>
            <ListItemText primary="Collect Fees" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/offlinepayments" sx={{ pl: 4 }}>
            <ListItemText primary="Offline Payment" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/searchfeespayment" sx={{ pl: 4 }}>
            <ListItemText primary="Search Fee" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/searchduesfees" sx={{ pl: 4 }}>
            <ListItemText primary="SearchDuesFees" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/feesmaster" sx={{ pl: 4 }}>
            <ListItemText primary="FeesMaster" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/quickfeesmaster" sx={{ pl: 4 }}>
            <ListItemText primary="QuickFeesMaster" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/addfeesgroup" sx={{ pl: 4 }}>
            <ListItemText primary="AddFeesGroup" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/feestypemanager" sx={{ pl: 4 }}>
            <ListItemText primary="FeesTypeManager" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/feesdiscountmanager" sx={{ pl: 4 }}>
            <ListItemText primary="FeesDiscountManager" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/feesCarryForward" sx={{ pl: 4 }}>
            <ListItemText primary="FeesCarryForward" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Admin/feerelated/fessreminder" sx={{ pl: 4 }}>
            <ListItemText primary="FessReminder" />
        </ListItemButton>
    </List>
</Collapse>
            {/* Teachers */}
            <ListItemButton onClick={() => handleToggle('teachers')}>
                <ListItemIcon>
                    <SupervisorAccountOutlinedIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Teachers" />
                {open.teachers ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.teachers} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton component={Link} to="/Admin/teacherall/teacherform" sx={{ pl: 4 }}>
                        <ListItemText primary="Add Teacher" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/teacherall/manageteacher" sx={{ pl: 4 }}>
                        <ListItemText primary="Manage Teachers" />
                    </ListItemButton>
                </List>
            </Collapse>

            {/* Students */}
            <ListItemButton onClick={() => handleToggle('students')}>
                <ListItemIcon>
                    <PersonOutlineIcon color={location.pathname.startsWith("/Admin/students") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Students" />
                {open.students ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open.students} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {/* <ListItemButton component={Link} to="/Admin/students/branches" sx={{ pl: 4 }}>
                        <ListItemText primary="Branches" />
                    </ListItemButton> */}
                    {/* <ListItemButton component={Link} to="/Admin/studentall/studentdetail" sx={{ pl: 4 }}>
                        <ListItemText primary="Student Details" />
                    </ListItemButton> */}
                    <ListItemButton component={Link} to="/Admin/studentall/studentadmissionform" sx={{ pl: 4 }}>
                        <ListItemText primary=" Admission" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/disablestudents" sx={{ pl: 4 }}>
                        <ListItemText primary="Disabled Students" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/studentsearch" sx={{ pl: 4 }}>
                        <ListItemText primary="Multiple Class Student" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/bulkdeletestudents" sx={{ pl: 4 }}>
                        <ListItemText primary="Bulk Delete" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/categorymanager" sx={{ pl: 4 }}>
                        <ListItemText primary="Student Categories" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/housestudent" sx={{ pl: 4 }}>
                        <ListItemText primary="Student House" />
                    </ListItemButton>
                    <ListItemButton component={Link} to="/Admin/studentall/disablereason" sx={{ pl: 4 }}>
                        <ListItemText primary="Disable Reason" />
                    </ListItemButton>
                </List>
            </Collapse>



            {/*library*/}

     <ListItemButton onClick={() => handleToggle('librarian')}>
    <ListItemIcon>
        <LocalLibraryIcon color={location.pathname.startsWith("/Admin/AddLibrarian") ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Librarian" />
    {open.librarian ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={open.librarian} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton component={Link} to="/Admin/AddLibrarian" sx={{ pl: 4 }}>
            <ListItemIcon>
                <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Librarian" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/ManageLibrarians" sx={{ pl: 4 }}>
            <ListItemIcon>
                <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Librarian" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/library/BookList" sx={{ pl: 4 }}>
            <ListItemIcon>
                <MenuBookIcon /> {/* Icon for Book List */}
            </ListItemIcon>
            <ListItemText primary="Book List" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/library/IssueReturn" sx={{ pl: 4 }}>
            <ListItemIcon>
                <AssignmentReturnIcon /> {/* Icon for Issue/Return */}
            </ListItemIcon>
            <ListItemText primary="Issue/Return" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/AddStudent" sx={{ pl: 4 }}>
            <ListItemIcon>
                <PersonAddIcon /> {/* Icon for Add Student */}
            </ListItemIcon>
            <ListItemText primary="Add Student" />
        </ListItemButton>
    </List>
</Collapse>


   {/*Income*/}

   <ListItemButton onClick={() => handleToggle('income')}>
    <ListItemIcon>
        <AttachMoneyIcon color={open.income ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Income" />
    {open.income ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open.income} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton
            component={Link}
            to="/Admin/income/addincome"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/income/addincome" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AddIcon color={location.pathname === "/Admin/income/addincome" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Add Income" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/income/searchincomepage"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/income/searchincomepage" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <SearchIcon color={location.pathname === "/Admin/SearchIncome" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Search Income" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/income/incomeheadpage"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/income/incomeheadpage" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AccountBalanceWalletIcon color={location.pathname === "/Admin/income/incomeheadpage" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Income Head" />
        </ListItemButton>
    </List>
</Collapse>

   {/* Expenses*/}



   <ListItemButton onClick={() => handleToggle('expenses')}>
    <ListItemIcon>
        <ReceiptIcon color={open.expenses ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Expenses" />
    {open.expenses ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open.expenses} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton
            component={Link}
            to="/Admin/expenses/addexpenses"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/expenses/addexpenses" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AddIcon color={location.pathname === "/Admin/expenses/addexpenses" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Add Expenses" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/expenses/searchexpensespage"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/expenses/searchexpensespage" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <SearchIcon color={location.pathname === "/Admin/expenses/searchexpensespage" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Search Expenses" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/expenses/expenseheadpage"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/expenses/expenseheadpage" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AccountTreeIcon color={location.pathname === "/Admin/expenses/expenseheadpage" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Expenses Head" />
        </ListItemButton>
    </List>
</Collapse>


   {/* Examination */}


   <ListItemButton onClick={() => handleToggle('examination')}>
    <ListItemIcon>
        <MenuBookIcon color={open.examination ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Examination" />
    {open.examination ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open.examination} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton
            component={Link}
            to="/Admin/examination/groupexam"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/groupexam" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <GroupIcon color={location.pathname === "/Admin/examination/groupexam" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Exam Group" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/examination/examschedule"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/examschedule" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <EventIcon color={location.pathname === "/Admin/examination/examschedule" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Exam Schedule" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/examination/examresult"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/examresult" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AssessmentIcon color={location.pathname === "/Admin/examination/examresult" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Exam Result" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/examination/admitcardpage"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/admitcardpage" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <CreditCardIcon color={location.pathname === "/Admin/examination/admitcardpage" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Design Admit Card" />
        </ListItemButton>

        {/* <ListItemButton
            component={Link}
            to="/Admin/examination/printadmitcard"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/printadmitcard" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <PrintIcon color={location.pathname === "/Admin/examination/printadmitcard" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Print Admit Card" />
        </ListItemButton> */}

        <ListItemButton
            component={Link}
            to="/Admin/examination/marksheetdesigner"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/marksheetdesigner" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <DescriptionIcon color={location.pathname === "/Admin/examination/marksheetdesigner" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Design Marksheet" />
        </ListItemButton>

        {/* <ListItemButton
            component={Link}
            to="/Admin/examination/printmarksheet"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/printmarksheet" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <PrintIcon color={location.pathname === "/Admin/examination/printmarksheet" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Print Marksheet" />
        </ListItemButton> */}

        <ListItemButton
            component={Link}
            to="/Admin/examination/markgrade"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/markgrade" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <GradeIcon color={location.pathname === "/Admin/examination/markgrade" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Mark Grade" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/examination/markdivision"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/examination/markdivision" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <CategoryIcon color={location.pathname === "/Admin/examination/markdivision" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Mark Division" />
        </ListItemButton>
    </List>
</Collapse>




 {/* Academics */}

 <ListItemButton onClick={() => handleToggle('academics')}>
    <ListItemIcon>
        <SchoolIcon color={open.academics ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Academics" />
    {open.academics ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open.academics} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton
            component={Link}
            to="/Admin/academics/classtimetable"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/classtimetable" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <ClassIcon color={location.pathname === "/Admin/academics/classtimetable" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Class Timetable" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/teachertimetable"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/teachertimetable" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <ScheduleIcon color={location.pathname === "/Admin/academics/teachertimetable" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Teacher Timetable" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/assignclassteacher"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/assignclassteacher" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <AssignmentIndIcon color={location.pathname === "/Admin/academics/assignclassteacher" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Assign Class Teacher" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/promotestudents"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/promotestudents" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <TrendingUpIcon color={location.pathname === "/Admin/academics/promotestudents" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Promote Students" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/subjectgroup"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/subjectgroup" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <GroupWorkIcon color={location.pathname === "/Admin/academics/subjectgroup" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Subject Group" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/subjects"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/subjects" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <SubjectIcon color={location.pathname === "/Admin/academics/subjects" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Subjects" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/Classes"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/Classes" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <ClassIcon color={location.pathname === "/Admin/academics/Classes" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Class" />
        </ListItemButton>

        <ListItemButton
            component={Link}
            to="/Admin/academics/sections"
            sx={{
                pl: 4,
                backgroundColor: location.pathname === "/Admin/academics/sections" ? "#E8C897" : "inherit",
                '&:hover': { backgroundColor: "#E8C897" },
            }}
        >
            <ListItemIcon>
                <ViewColumnIcon color={location.pathname === "/Admin/academics/sections" ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Sections" />
        </ListItemButton>
    </List>
</Collapse>

 {/* Transport */}
 

 <ListItemButton onClick={() => handleToggle('transport')}>
    <ListItemIcon>
        <CommuteIcon color={location.pathname.startsWith("/Admin/Transport") ? 'primary' : 'inherit'} />
    </ListItemIcon>
    <ListItemText primary="Transport" />
    {open.transport ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={open.transport} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
        <ListItemButton component={Link} to="/Admin/transport/TransportFeesMaster" sx={{ pl: 4 }}>
            <ListItemIcon>
                <AccountBalanceWalletIcon /> {/* Icon for Fees Master */}
            </ListItemIcon>
            <ListItemText primary="Fees Master" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/transport/PickupPointList" sx={{ pl: 4 }}>
            <ListItemIcon>
                <RoomIcon /> {/* Icon for Pickup Point */}
            </ListItemIcon>
            <ListItemText primary="Pickup Point" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/Transport/RoutesAdd" sx={{ pl: 4 }}>
            <ListItemIcon>
                <AltRouteIcon /> {/* Icon for Routes */}
            </ListItemIcon>
            <ListItemText primary="Routes" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/Transport/VehicleList" sx={{ pl: 4 }}>
            <ListItemIcon>
                <DirectionsBusIcon /> {/* Icon for Vehicle */}
            </ListItemIcon>
            <ListItemText primary="Vehicle" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/Transport/AssignVehicle" sx={{ pl: 4 }}>
            <ListItemIcon>
                <AssignmentIndIcon /> {/* Icon for Assign Vehicle */}
            </ListItemIcon>
            <ListItemText primary="Assign Vehicle" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/Transport/RoutePickupPoint" sx={{ pl: 4 }}>
            <ListItemIcon>
                <MapIcon /> {/* Icon for Route Pickup Point */}
            </ListItemIcon>
            <ListItemText primary="Route Pickup Point" />
        </ListItemButton>

        <ListItemButton component={Link} to="/Admin/Transport/TransportFees" sx={{ pl: 4 }}>
            <ListItemIcon>
                <MonetizationOnIcon /> {/* Icon for Student Transport Fees */}
            </ListItemIcon>
            <ListItemText primary="Student Transport Fees" />
        </ListItemButton>
    </List>
</Collapse>


 {/* Inventory */}

 <ListItemButton onClick={() => handleToggle('inventory')}>
  <ListItemIcon>
    <Inventory2Icon color={location.pathname.startsWith("/Admin/Inventory") ? 'primary' : 'inherit'} />
  </ListItemIcon>
  <ListItemText primary="Inventory" />
  {open.inventory ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>

<Collapse in={open.inventory} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    <ListItemButton component={Link} to="/Admin/Inventory/IssueItem" sx={{ pl: 4 }}>
      <ListItemIcon>
        <AssignmentReturnIcon /> {/* Icon for Issue Item */}
      </ListItemIcon>
      <ListItemText primary="Issue Item" />
    </ListItemButton>

    <ListItemButton component={Link} to="/Admin/Inventory/AddItemStocks" sx={{ pl: 4 }}>
      <ListItemIcon>
        <PlaylistAddIcon /> {/* Icon for Add Item Stocks */}
      </ListItemIcon>
      <ListItemText primary="Add Item Stocks" />
    </ListItemButton>

    <ListItemButton component={Link} to="/Admin/Inventory/ItemList" sx={{ pl: 4 }}>
      <ListItemIcon>
        <AddBoxIcon /> {/* Icon for Add Item */}
      </ListItemIcon>
      <ListItemText primary="Add Item" />
    </ListItemButton>

    <ListItemButton component={Link} to="/Admin/Inventory/ItemCategory" sx={{ pl: 4 }}>
      <ListItemIcon>
        <CategoryIcon /> {/* Icon for Item Category */}
      </ListItemIcon>
      <ListItemText primary="Item Category" />
    </ListItemButton>

    <ListItemButton component={Link} to="/Admin/Inventory/ItemStore" sx={{ pl: 4 }}>
      <ListItemIcon>
        <StoreIcon /> {/* Icon for Item Store */}
      </ListItemIcon>
      <ListItemText primary="Item Store" />
    </ListItemButton>

    <ListItemButton component={Link} to="/Admin/Inventory/ItemSupplier" sx={{ pl: 4 }}>
      <ListItemIcon>
        <LocalShippingIcon /> {/* Icon for Item Supplier */}
      </ListItemIcon>
      <ListItemText primary="Item Supplier" />
    </ListItemButton>
  </List>
</Collapse>

 








   

            {/* Notices */}
            <ListItemButton component={Link} to="/Admin/notices">
                <ListItemIcon>
                    <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Admin/notices") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Notices" />
            </ListItemButton>

            {/* Complaints */}
            <ListItemButton component={Link} to="/Admin/complains">
                <ListItemIcon>
                    <ReportIcon color={location.pathname.startsWith("/Admin/complains") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Complains" />
            </ListItemButton>

           
            

            <Divider sx={{ my: 1 }} />

            {/* User Section */}
            <ListSubheader component="div" inset>
                User
            </ListSubheader>
            <ListItemButton component={Link} to="/Admin/profile">
                <ListItemIcon>
                    <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Admin/profile") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton component={Link} to="/logout">
                <ListItemIcon>
                    <ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
          
            
        </List>
    );
}

export default SideBar;
