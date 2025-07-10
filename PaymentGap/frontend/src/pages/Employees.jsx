import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

// Utility functions
const getAge = (dateString) => {
  if (!dateString) return '';
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const normalizeGender = (gender) => {
  if (!gender) return '';
  const g = gender.toLowerCase();
  if (g === 'm' || g === 'male') return 'Male';
  if (g === 'f' || g === 'female') return 'Female';
  return gender;
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  // Responsiveness hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('http://localhost:3000/employees/getAllEmployees')
      .then(res => {
        setEmployees(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Filter and sort
  const filtered = employees
    .filter(emp =>
      `${emp.first_name} ${emp.second_name} ${emp.email} ${emp.phone} ${emp.gender} ${emp.nationality}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = (sortField === 'age') ? getAge(a.date_of_birth) : a[sortField];
      let bValue = (sortField === 'age') ? getAge(b.date_of_birth) : b[sortField];
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 3, m: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Employee List
      </Typography>

      <TextField
        label="Search Employee"
        value={search}
        onChange={e => setSearch(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />

      {isMobile ? (
        // Mobile: list view cards
        <List>
          {filtered.map(emp => (
            <ListItem key={emp.id_employee} sx={{ mb: 1, p: 0 }}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {emp.first_name} {emp.second_name}
                  </Typography>
                  <Typography variant="body2">Email: {emp.email}</Typography>
                  <Typography variant="body2">Phone: {emp.phone}</Typography>
                  <Typography variant="body2">Gender: {normalizeGender(emp.gender)}</Typography>
                  <Typography variant="body2">Age: {getAge(emp.date_of_birth)}</Typography>
                  <Typography variant="body2">Department: {emp.department_name}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => {/* navigate to detail */}}>Details</Button>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        // Desktop: horizontal scroll table
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  { id: 'first_name', label: 'First Name' },
                  { id: 'second_name', label: 'Second Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'employment_date', label: 'Employment Date' },
                  { id: 'salary', label: 'Salary' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'age', label: 'Age' },
                  { id: 'nationality', label: 'Nationality' },
                  { id: 'department_name', label: 'Department' },
                  { id: 'job_title', label: 'Job Title' },
                ].map(col => (
                  <TableCell key={col.id} sortDirection={sortField === col.id ? sortOrder : false}>
                    <TableSortLabel
                      active={sortField === col.id}
                      direction={sortField === col.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(emp => (
                <TableRow key={emp.id_employee} hover>
                  <TableCell>{emp.first_name}</TableCell>
                  <TableCell>{emp.second_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.employment_date?.slice(0,10)}</TableCell>
                  <TableCell>{emp.salary}</TableCell>
                  <TableCell>{normalizeGender(emp.gender)}</TableCell>
                  <TableCell>{getAge(emp.date_of_birth)}</TableCell>
                  <TableCell>{emp.nationality}</TableCell>
                  <TableCell>{emp.department_name}</TableCell>
                  <TableCell>{emp.job_title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filtered.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No employee found.
        </Typography>
      )}
    </Paper>
  );
}
