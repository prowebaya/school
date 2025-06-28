import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, Card, CardContent, Snackbar, Alert, InputAdornment, FormControl, InputLabel
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExpenses, clearExpenseError } from '../../../redux/expenseRelated/expenseHandle';
import { getAllExpenseHeads } from '../../../redux/expenseRelated/expenseHeadHandle';

const SearchExpensesPage = () => {
  const [searchType, setSearchType] = useState('last6months');
  const [searchQuery, setSearchQuery] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseState = useSelector((state) => state.expense || { expensesList: [], loading: false, error: null });
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expensesList, loading, error } = expenseState;
  const { expenseHeadsList } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  const timeFilters = [
    { value: 'today', label: 'Today' },
    { value: 'thisweek', label: 'This Week' },
    { value: 'lastweek', label: 'Last Week' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom Date' },
    { value: 'byExpense', label: 'Search by Expense' },
  ];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenses(adminID));
      dispatch(getAllExpenseHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view expenses', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseError());
    }
  }, [error, dispatch]);

  const getDateRange = (filter) => {
    const today = new Date();
    switch (filter) {
      case 'today':
        return {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
        };
      case 'thisweek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          start: new Date(startOfWeek.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
        };
      case 'lastweek':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7 - today.getDay());
        return {
          start: new Date(lastWeek.setHours(0, 0, 0, 0)),
          end: new Date(lastWeek.setDate(lastWeek.getDate() + 6)),
        };
      case 'thismonth':
        return {
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        };
      case 'lastmonth':
        return {
          start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
      case 'last6months':
        return {
          start: new Date(today.setMonth(today.getMonth() - 6)),
          end: new Date(),
        };
      case 'last12months':
        return {
          start: new Date(today.setMonth(today.getMonth() - 12)),
          end: new Date(),
        };
      case 'custom':
        return {
          start: customStartDate ? new Date(customStartDate) : null,
          end: customEndDate ? new Date(customEndDate) : null,
        };
      default:
        return { start: null, end: null };
    }
  };

  const handleSearch = () => {
    let results = [];

    if (searchType === 'byExpense') {
      results = expensesList.filter((expense) =>
        Object.values(expense).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      const { start, end } = getDateRange(searchType);
      if (start && end) {
        results = expensesList.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= start && expenseDate <= end;
        });
      } else {
        results = expensesList;
      }
    }

    setFilteredExpenses(results);
  };

  useEffect(() => {
    handleSearch();
  }, [searchType, searchQuery, customStartDate, customEndDate, expensesList]);

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          color: '#1a2526',
          mb: 4,
          fontSize: { xs: '1.5rem', md: '2.125rem' },
        }}
      >
        Search Expenses
      </Typography>

      <Grid container spacing={3}>
        {/* Search Criteria Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Select Search Criteria
              </Typography>
              <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
                <InputLabel>Search Type</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Search Type"
                  size="small"
                >
                  {timeFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {searchType === 'byExpense' && (
                <TextField
                  fullWidth
                  label="Search expenses"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search by name, description, or amount..."
                />
              )}

              {searchType === 'custom' && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 150 }}
                  />
                  <Typography>to</Typography>
                  <TextField
                    type="date"
                    label="End Date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 150 }}
                    inputProps={{ min: customStartDate }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Search Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense List Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2526' }}>
                Expense List
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Name', 'Invoice Number', 'Expense Head', 'Date', 'Amount (₹)'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            p: { xs: 1, md: 2 },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          <Typography>No matching expenses found</Typography>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
                            onClick={() => window.location.href = '/add-expenses'} // Adjust route as needed
                          >
                            Add New Expense
                          </Button>
                          <Typography sx={{ mt: 1 }}>or try different search criteria</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense, idx) => (
                        <TableRow
                          key={expense._id}
                          sx={{
                            bgcolor: idx % 2 ? '#fff' : '#f9f9f9',
                            '&:hover': { bgcolor: '#e0f7fa' },
                          }}
                        >
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.invoiceNumber}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.expenseHead}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            ₹{parseFloat(expense.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{ mt: 2, color: '#1a2526' }}>
                Records: {filteredExpenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchExpensesPage;