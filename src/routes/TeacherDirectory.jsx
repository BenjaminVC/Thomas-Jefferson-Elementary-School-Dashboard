import { Box, Container, Typography, Pagination } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import TeacherTable from "../components/TeacherTable.jsx";

export default function TeacherDirectory() {
  const [teachersData, setTeachersData] = useState([]);
  const [classMap, setClassMap] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Fetch teachers data from database
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "teachers"));
      const loaded = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeachersData(loaded);

      const classSnapshot = await getDocs(collection(db, "classes"));
      const map = {};
      classSnapshot.forEach((doc) => {
        map[doc.id] = doc.data().name; 
      });
      setClassMap(map);
    }
    fetchData();
  }, []);

  // useMemo to memoize the sorted teachers
  const sortedTeachers = useMemo(() => {
    const sorted = [...teachersData];

    sorted.sort((a, b) => {
      let aKey = a[sortConfig.key];
      let bKey = b[sortConfig.key];
      if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig, teachersData]);

  // Function to handle sorting when a column header is clicked
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  // useMemo to memoize the filtered teachers
  const filteredTeachers = useMemo(() => {
    if (!searchQuery) return sortedTeachers;
    const q = searchQuery.toLowerCase();

    return sortedTeachers.filter((s) =>
      Object.values(s).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [searchQuery, sortedTeachers]);

  // useMemo to memoize the paginated teachers
  const paginatedTeachers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredTeachers.slice(start, start + rowsPerPage);
  }, [page, filteredTeachers]);

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Teachers
        </Typography>

        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <TeacherTable
          rows={paginatedTeachers}
          sortConfig={sortConfig}
          onSort={handleSort}
          classMap={classMap}
        />

        <Box display="flex" justifyContent="flex-end" p={2}>
          <Pagination
            count={Math.ceil(filteredTeachers.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            showFirstButton
            showLastButton
            size="small"
          />
        </Box>
      </Container>
    </>
  );
}
