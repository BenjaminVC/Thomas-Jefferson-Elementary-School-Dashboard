import { Table, TableBody, TableContainer, Paper, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";

import ExpandableStudentRow from "./ExpandableStudentRow";
import StudentTableHeader from "./StudentTableHeader.jsx";
import "../../styles/StudentDirectory.css";

export default function StudentTable({ rows, sortConfig, onSort, onEdit, onDelete }) {
  const [openRow, setOpenRow] = useState({});

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  // Column configuration for the table
  const columns = [
    {
      key: "first",
      label: "First",
      sortable: true,
      headerSx: { px: 2, width: 150 },
      cellSx: { px: 2 },
    },
    {
      key: "last",
      label: "Last",
      sortable: true,
      headerSx: { px: 0, width: 150 },
      cellSx: { px: 0 },
    },
    {
      key: "year",
      label: "Year",
      sortable: true,
      headerSx: { px: 1, width: 60 },
      cellSx: { px: 2 },
      render: (v) => (v === 0 ? "K" : v),
    },
    {
      key: "email",
      label: "Email",
      sortable: false,
      headerSx: { px: 2, width: 200 },
      cellSx: { px: 2 },
    },
    {
      key: "finalGrade",
      label: "Final Grade",
      sortable: true,
      headerSx: { px: 0, width: 130 },
      cellSx: { px: 2 },
      render: (v) => (v != null ? v.toFixed(2) : "—"),
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      sortable: true,
      headerSx: { px: 1 },
      cellSx: { px: 1 },
      render: (v) =>
        v
          ? new Date(v).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—",
    },
    {
      key: "actions",
      sortable: false,
      cellSx: { textAlign: "right" },
      render: (_, row) => (
        <>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <TableContainer component={Paper} className="student-table-container">
      <Table stickyHeader className="student-table">
        {/* TableHead is where the column headers are defined */}
        <StudentTableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />

        {/* TableBody is where the actual data rows are rendered */}
        <TableBody>
          {rows.map((row) => (
            // Each row is rendered here
            <ExpandableStudentRow
              key={row.id}
              row={row}
              columns={columns}
              isOpen={openRow === row.id}
              onToggle={toggleRow}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
