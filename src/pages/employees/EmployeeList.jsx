import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Stack,
  InputAdornment,
  Button,
  Skeleton,
} from "@mui/material";
import {
  Search,
  FilterList,
  Refresh,
  Clear,
  CheckCircle,
  Cancel,
  PersonOff,
} from "@mui/icons-material";
import { employeeService } from "../../lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const GRADE_OPTIONS = ["A", "B", "C", "D"];
const DEPT_OPTIONS = ["HR", "IT", "Finance", "Operations", "Legal"];
const ROLE_OPTIONS = [
  { value: "employee", label: "Employee" },
  { value: "admin", label: "Admin" },
];
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const COLUMNS = [
  { id: "display_name", label: "Employee", sortable: true },
  { id: "employee_id", label: "ID", sortable: true },
  { id: "department", label: "Department", sortable: true },
  { id: "designation", label: "Designation", sortable: true },
  { id: "grade", label: "Grade", sortable: true },
  { id: "work_email", label: "Email", sortable: false },
  { id: "mobile_number", label: "Mobile", sortable: false },
  { id: "work_location", label: "Location", sortable: true },
  { id: "system_role", label: "System Role", sortable: true },
  { id: "date_of_joining", label: "Joined", sortable: true },
  { id: "is_active", label: "Status", sortable: true },
];

const EMPTY_FILTERS = { grade: "", department: "", role: "", status: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const descendingComparator = (a, b, key) => {
  const va = a[key] ?? "";
  const vb = b[key] ?? "";
  if (vb < va) return -1;
  if (vb > va) return 1;
  return 0;
};

const getComparator = (order, orderBy) => (a, b) =>
  order === "desc"
    ? descendingComparator(a, b, orderBy)
    : -descendingComparator(a, b, orderBy);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusChip = ({ active }) =>
  active ? (
    <Chip
      icon={<CheckCircle sx={{ fontSize: "0.85rem !important" }} />}
      label="Active"
      size="small"
      color="success"
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: "0.72rem" }}
    />
  ) : (
    <Chip
      icon={<Cancel sx={{ fontSize: "0.85rem !important" }} />}
      label="Inactive"
      size="small"
      color="default"
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: "0.72rem", color: "text.disabled" }}
    />
  );

const RoleChip = ({ role }) => {
  const colorMap = {
    admin: "error",
    super_admin: "error",
    org_admin: "warning",
    user: "default",
  };
  const color = colorMap[role?.toLowerCase()] ?? "default";
  return (
    <Chip
      label={role ?? "—"}
      size="small"
      color={color}
      variant="filled"
      sx={{ fontWeight: 600, fontSize: "0.72rem", textTransform: "capitalize" }}
    />
  );
};

const FilterSelect = ({ id, label, value, onChange, options }) => (
  <FormControl size="small" sx={{ minWidth: 130 }}>
    <InputLabel id={`${id}-label`}>{label}</InputLabel>
    <Select
      labelId={`${id}-label`}
      id={id}
      value={value}
      label={label}
      onChange={(e) => onChange(e.target.value)}
    >
      <MenuItem value="">
        <em>All</em>
      </MenuItem>
      {options.map((opt) =>
        typeof opt === "string" ? (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ) : (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ),
      )}
    </Select>
  </FormControl>
);

const LoadingRows = ({ cols, rows = 8 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton variant="text" width={j === 0 ? 160 : 80} />
        </TableCell>
      ))}
    </TableRow>
  ));

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeList() {
  // ── Data state ──
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI state ──
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [orderBy, setOrderBy] = useState("display_name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_OPTIONS[0]);

  // ── Fetch ──
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees();
      setAllEmployees(data ?? []);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ── Derived: filtered + sorted list ──
  const processed = useMemo(() => {
    const q = search.trim().toLowerCase();

    return [...allEmployees]
      .filter((emp) => {
        if (q) {
          const hit =
            emp.display_name?.toLowerCase().includes(q) ||
            emp.work_email?.toLowerCase().includes(q) ||
            emp.employee_id?.toLowerCase().includes(q) ||
            emp.designation?.toLowerCase().includes(q);
          if (!hit) return false;
        }
        if (filters.grade && emp.grade !== filters.grade) return false;
        if (filters.department && emp.department !== filters.department)
          return false;
        if (filters.role && emp.system_role !== filters.role) return false;
        if (filters.status === "active" && !emp.is_active) return false;
        if (filters.status === "inactive" && emp.is_active) return false;
        return true;
      })
      .sort(getComparator(order, orderBy));
  }, [allEmployees, search, filters, order, orderBy]);

  const paginated = useMemo(
    () => processed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [processed, page, rowsPerPage],
  );

  // ── Handlers ──
  const handleSort = (col) => {
    setOrder(orderBy === col && order === "asc" ? "desc" : "asc");
    setOrderBy(col);
    setPage(0);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const hasActiveFilters = search || Object.values(filters).some(Boolean);
  const clearAll = () => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
    setPage(0);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.5px">
            Employees
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {loading
              ? "Loading…"
              : `${processed.length} of ${allEmployees.length} employees`}
          </Typography>
        </Box>

        <Tooltip title="Refresh">
          <IconButton onClick={fetchEmployees} disabled={loading} size="small">
            <Refresh fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button size="small" onClick={fetchEmployees}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* ── Search + Filters ── */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          flexWrap="wrap"
          alignItems="flex-end"
        >
          <TextField
            size="small"
            placeholder="Search name, email, ID, or role…"
            value={search}
            onChange={handleSearchChange}
            sx={{ flex: 1, minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FilterList fontSize="small" sx={{ color: "text.secondary" }} />

            <FilterSelect
              id="grade"
              label="Grade"
              value={filters.grade}
              onChange={(v) => handleFilterChange("grade", v)}
              options={GRADE_OPTIONS}
            />
            <FilterSelect
              id="department"
              label="Department"
              value={filters.department}
              onChange={(v) => handleFilterChange("department", v)}
              options={DEPT_OPTIONS}
            />
            <FilterSelect
              id="role"
              label="Role"
              value={filters.role}
              onChange={(v) => handleFilterChange("role", v)}
              options={ROLE_OPTIONS}
            />
            <FilterSelect
              id="status"
              label="Status"
              value={filters.status}
              onChange={(v) => handleFilterChange("status", v)}
              options={STATUS_OPTIONS}
            />

            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<Clear fontSize="small" />}
                onClick={clearAll}
                color="inherit"
                sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* ── Table ── */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "text.secondary",
                      bgcolor: "grey.50",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : "asc"}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <LoadingRows cols={COLUMNS.length} />
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <PersonOff
                      sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No employees match the current filters.
                    </Typography>
                    {hasActiveFilters && (
                      <Button size="small" onClick={clearAll} sx={{ mt: 1 }}>
                        Clear filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((emp) => (
                  <TableRow
                    key={emp.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    {/* Employee (avatar + name + email) */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.25,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: "0.75rem",
                            bgcolor: "primary.main",
                            flexShrink: 0,
                          }}
                        >
                          {initials(emp.display_name)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ maxWidth: 160 }}
                          >
                            {emp.display_name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 160 }}
                          >
                            {emp.work_email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        fontFamily="monospace"
                        color="text.secondary"
                      >
                        {emp.employee_id ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {emp.department ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                        {emp.designation ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={emp.grade ?? "—"}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, minWidth: 32 }}
                      />
                    </TableCell>

                    {/* Email hidden — already shown in name cell */}
                    <TableCell>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 180 }}
                      >
                        {emp.work_email ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {emp.mobile_number ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {emp.work_location ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <RoleChip role={emp.system_role} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {formatDate(emp.date_of_joining)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <StatusChip active={emp.is_active} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Pagination ── */}
        {!loading && processed.length > 0 && (
          <TablePagination
            component="div"
            count={processed.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            sx={{ borderTop: "1px solid", borderColor: "divider" }}
          />
        )}
      </Paper>
    </Box>
  );
}
