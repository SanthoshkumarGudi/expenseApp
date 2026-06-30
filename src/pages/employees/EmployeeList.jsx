import { useEffect, useState, useMemo, useCallback, memo } from "react";
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
  Collapse,
  Divider,
} from "@mui/material";
import {
  Search,
  Refresh,
  Clear,
  CheckCircle,
  Cancel,
  PersonOff,
  Edit,
  PersonAdd,
  TuneOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { employeeService } from "../../lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const GRADE_OPTIONS = ["A", "B", "C", "D"];
const DEPT_OPTIONS = ["HR", "IT", "Finance", "Operations", "Legal"];
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];
const ROLE_OPTIONS = [
  { value: "employee", label: "Employee" },
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "manager", label: "Manager" },
];

const COLUMNS = [
  { id: "display_name", label: "Employee", sortable: true, show: "xs" },
  { id: "employee_id", label: "ID", sortable: true, show: "sm" },
  { id: "department", label: "Department", sortable: true, show: "md" },
  { id: "designation", label: "Designation", sortable: true, show: "lg" },
  { id: "grade", label: "Grade", sortable: true, show: "md" },
  { id: "work_location", label: "Location", sortable: true, show: "lg" },
  { id: "system_role", label: "Role", sortable: true, show: "sm" },
  { id: "date_of_joining", label: "Joined", sortable: true, show: "md" },
  { id: "is_active", label: "Status", sortable: true, show: "xs" },
  { id: "actions", label: "", sortable: false, show: "xs", align: "right" },
];

const showDisplay = (show) =>
  ({
    xs: "table-cell",
    sm: { xs: "none", sm: "table-cell" },
    md: { xs: "none", md: "table-cell" },
    lg: { xs: "none", lg: "table-cell" },
  })[show];

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

// ─── Memoized Sub-components ──────────────────────────────────────────────────
// React.memo prevents re-renders when parent state changes but props haven't

const StatusChip = memo(({ active }) =>
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
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: "0.72rem", color: "text.disabled" }}
    />
  ),
);
StatusChip.displayName = "StatusChip";

const RoleChip = memo(({ role }) => {
  const colorMap = {
    admin: "error",
    manager: "warning",
    hr: "info",
    employee: "default",
  };
  return (
    <Chip
      label={role ?? "—"}
      size="small"
      color={colorMap[role?.toLowerCase()] ?? "default"}
      variant="filled"
      sx={{ fontWeight: 600, fontSize: "0.72rem", textTransform: "capitalize" }}
    />
  );
});
RoleChip.displayName = "RoleChip";

const FilterSelect = memo(({ id, label, value, onChange, options }) => (
  <FormControl size="small" fullWidth>
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
));
FilterSelect.displayName = "FilterSelect";

// Memoized individual table row — only re-renders if this employee's data changes
const EmployeeRow = memo(({ emp, onEdit }) => (
  <TableRow hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
    {/* Employee — xs+ */}
    <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          sx={{
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            fontSize: "0.7rem",
            bgcolor: "primary.main",
            flexShrink: 0,
          }}
        >
          {initials(emp.display_name)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: { xs: 90, sm: 140, md: 180 } }}
          >
            {emp.display_name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{
              display: { xs: "block", md: "none" },
              maxWidth: { xs: 90, sm: 160 },
            }}
          >
            {emp.work_email}
          </Typography>
        </Box>
      </Box>
    </TableCell>

    {/* ID — sm+ */}
    <TableCell
      sx={{ display: showDisplay("sm"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Typography
        variant="caption"
        fontFamily="monospace"
        color="text.secondary"
      >
        {emp.employee_id ?? "—"}
      </Typography>
    </TableCell>

    {/* Department — md+ */}
    <TableCell
      sx={{ display: showDisplay("md"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Typography variant="body2">{emp.department ?? "—"}</Typography>
    </TableCell>

    {/* Designation — lg+ */}
    <TableCell
      sx={{ display: showDisplay("lg"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
        {emp.designation ?? "—"}
      </Typography>
    </TableCell>

    {/* Grade — md+ */}
    <TableCell
      sx={{ display: showDisplay("md"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Chip
        label={emp.grade ?? "—"}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 700, minWidth: 32 }}
      />
    </TableCell>

    {/* Location — lg+ */}
    <TableCell
      sx={{ display: showDisplay("lg"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Typography variant="body2">{emp.work_location ?? "—"}</Typography>
    </TableCell>

    {/* Role — sm+ */}
    <TableCell
      sx={{ display: showDisplay("sm"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <RoleChip role={emp.system_role} />
    </TableCell>

    {/* Joined — md+ */}
    <TableCell
      sx={{ display: showDisplay("md"), px: { xs: 1, sm: 1.5, md: 2 } }}
    >
      <Typography variant="body2" noWrap>
        {formatDate(emp.date_of_joining)}
      </Typography>
    </TableCell>

    {/* Status — xs+ */}
    <TableCell sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
      <StatusChip active={emp.is_active} />
    </TableCell>

    {/* Actions — xs+ */}
    <TableCell align="right" sx={{ px: { xs: 0.5, sm: 1, md: 2 } }}>
      <Tooltip title="Edit employee">
        <IconButton
          size="small"
          onClick={() => onEdit(emp.id)}
          sx={{ color: "primary.main" }}
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
));
EmployeeRow.displayName = "EmployeeRow";

const LoadingRows = memo(({ cols, rows = 8 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton variant="text" width={j === 0 ? 160 : 80} />
        </TableCell>
      ))}
    </TableRow>
  )),
);
LoadingRows.displayName = "LoadingRows";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeList() {
  const navigate = useNavigate();

  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [orderBy, setOrderBy] = useState("display_name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_OPTIONS[0]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees();
      setAllEmployees(data ?? []);
    } catch {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  // useCallback so EmployeeRow's onEdit prop reference stays stable
  // — prevents all rows re-rendering when parent state changes
  const handleEdit = useCallback(
    (id) => navigate(`/employees/${id}/edit`),
    [navigate],
  );

  const handleSort = useCallback(
    (col) => {
      setOrder((prev) => (orderBy === col && prev === "asc" ? "desc" : "asc"));
      setOrderBy(col);
      setPage(0);
    },
    [orderBy],
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(0);
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
    setPage(0);
  }, []);

  const toggleFilters = useCallback(() => setFiltersOpen((p) => !p), []);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters],
  );
  const hasActiveFilters = search || activeFilterCount > 0;

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 3 },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h5">Employees</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {loading
              ? "Loading…"
              : `${processed.length} of ${allEmployees.length} employees`}
          </Typography>
        </Box>

        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchEmployees}
              disabled={loading}
              size="small"
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<PersonAdd fontSize="small" />}
            onClick={() => navigate("/employees/add")}
            sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1 }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Add employee
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: "inline", sm: "none" } }}
            >
              Add
            </Box>
          </Button>
        </Stack>
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: 3 }}
          action={
            <Button size="small" onClick={fetchEmployees}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* ── Search + Filter toggle ── */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search name, email or ID…"
            value={search}
            onChange={handleSearchChange}
            sx={{ flex: 1 }}
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

          <Button
            size="small"
            variant={
              filtersOpen || activeFilterCount > 0 ? "contained" : "outlined"
            }
            onClick={toggleFilters}
            startIcon={<TuneOutlined fontSize="small" />}
            sx={{
              px: { xs: 1, sm: 1.5 },
              py: 1,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Box>
            {activeFilterCount > 0 && (
              <Box
                component="span"
                sx={{ display: { xs: "inline", sm: "none" } }}
              >
                {activeFilterCount}
              </Box>
            )}
          </Button>

          {hasActiveFilters && (
            <Tooltip title="Clear all filters">
              <IconButton
                size="small"
                onClick={clearAll}
                sx={{ flexShrink: 0 }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Collapse in={filtersOpen}>
          <Divider />
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
              gap: 1.5,
            }}
          >
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
          </Box>
        </Collapse>
      </Paper>

      {/* ── Table ── */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "text.secondary",
                      bgcolor: "background.default",
                      whiteSpace: "nowrap",
                      display: showDisplay(col.show),
                      px: { xs: 1, sm: 1.5, md: 2 },
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
                // key=emp.id ensures React reuses the same DOM node per employee
                // memo on EmployeeRow skips re-render if emp reference hasn't changed
                paginated.map((emp) => (
                  <EmployeeRow key={emp.id} emp={emp} onEdit={handleEdit} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
