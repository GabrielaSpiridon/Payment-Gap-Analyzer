import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, TextField, TableSortLabel, CircularProgress
} from '@mui/material';
import axios from 'axios';

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

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/employees/getAllEmployees')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const filtered = employees
    .filter(emp =>
      `${emp.first_name} ${emp.second_name} ${emp.email} ${emp.phone} ${emp.gender} ${emp.nationality}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'age') {
        aValue = getAge(a.date_of_birth);
        bValue = getAge(b.date_of_birth);
      }
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

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
        sx={{ mb: 2 }}
        fullWidth
      />
      <TableContainer>
        <Table>
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
                { id: 'job_title', label: 'Job Title' }
              ].map(col => (
                <TableCell key={col.id}>
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
            {filtered.map((emp) => (
              <TableRow key={emp.id_employee}>
                <TableCell>{emp.first_name}</TableCell>
                <TableCell>{emp.second_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.employment_date?.slice(0, 10)}</TableCell>
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
      {filtered.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No employee found.
        </Typography>
      )}
    </Paper>
  );
}

export default Employees;
