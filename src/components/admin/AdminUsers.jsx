import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '../../lib/api';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, CircularProgress, Alert, Avatar, Chip, Stack,
  Paper, Divider, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TableSortLabel,
  TablePagination, InputAdornment, Skeleton, Button,
} from '@mui/material';
import {
  PersonAdd, Refresh, Edit, Search, Clear,
  Check, Close, AdminPanelSettings, CheckCircle, Cancel,
} from '@mui/icons-material';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: 'member',  label: 'Member'  },
  { value: 'manager', label: 'Manager' },
  { value: 'admin',   label: 'Admin'   },
];

const ROLE_COLOR = { admin: 'error', manager: 'warning', member: 'default' };

const COLUMNS = [
  { id: 'full_name', label: 'User',    sortable: true  },
  { id: 'email',     label: 'Email',   sortable: true  },
  { id: 'role',      label: 'Role',    sortable: true  },
  { id: 'is_active', label: 'Status',  sortable: true  },
  { id: 'actions',   label: 'Actions', sortable: false, align: 'right' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const EMPTY_INVITE = { full_name: '', email: '', role: 'member' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const formatRole = (role = '') =>
  role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const descendingComparator = (a, b, key) => {
  const va = a[key] ?? '';
  const vb = b[key] ?? '';
  return vb < va ? -1 : vb > va ? 1 : 0;
};

const getComparator = (order, key) => (a, b) =>
  order === 'desc' ? descendingComparator(a, b, key) : -descendingComparator(a, b, key);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusChip = ({ active }) =>
  active ? (
    <Chip icon={<CheckCircle sx={{ fontSize: '0.8rem !important' }} />}
      label="Active" size="small" color="success" variant="outlined"
      sx={{ fontWeight: 600, fontSize: '0.72rem' }} />
  ) : (
    <Chip icon={<Cancel sx={{ fontSize: '0.8rem !important' }} />}
      label="Inactive" size="small" variant="outlined"
      sx={{ fontWeight: 600, fontSize: '0.72rem', color: 'text.disabled' }} />
  );

const RoleChip = ({ role }) => (
  <Chip label={formatRole(role)} size="small"
    color={ROLE_COLOR[role] ?? 'default'} variant="filled"
    sx={{ fontWeight: 600, fontSize: '0.72rem', textTransform: 'capitalize' }} />
);

const LoadingRows = ({ cols, rows = 6 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}><Skeleton variant="text" width={j === 0 ? 160 : 100} /></TableCell>
      ))}
    </TableRow>
  ));

// ─── Invite Form ──────────────────────────────────────────────────────────────

const InviteForm = ({ onSuccess, onError }) => {
  const [form, setForm]       = useState(EMPTY_INVITE);
  const [errors, setErrors]   = useState({});
  const [inviting, setInviting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Name is required.';
    if (!form.email.trim())     e.email     = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setInviting(true);
    try {
      await authService.inviteUser(form);
      setForm(EMPTY_INVITE);
      setErrors({});
      onSuccess('Invitation sent successfully!');
    } catch (err) {
      onError(err.response?.data?.message ?? 'Failed to send invitation.');
    } finally {
      setInviting(false);
    }
  };

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={2.5}>
        <PersonAdd fontSize="small" color="primary"/>
        <Typography variant="subtitle1" fontWeight={700}>Invite New User</Typography>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1}}>
        <Stack direction={{ xs: 'column', sm: 'column' , md: 'row' , lg: 'row' }} gap={2} flexWrap="wrap" alignItems="flex-start">
          <TextField
            label="Full Name" size="small" required
            value={form.full_name} onChange={set('full_name')}
            error={!!errors.full_name} helperText={errors.full_name}
            sx={{ flex: 1, minWidth: 180, maxWidth: 300,  p: {xs:0.5, sm: 1 , md:1 , lg:1} }}
          />
       
          <TextField
            label="Email Address" type="email" size="small" required
            value={form.email} onChange={set('email')}
            error={!!errors.email} helperText={errors.email}
            sx={{ flex: 1, minWidth: 180, maxWidth: 300 ,  p: {xs:0.5, sm: 1, md:1 , lg:1} }}
          />
          <FormControl size="small" sx={{ minWidth: 180, maxWidth:300, p: {xs:0.5, sm: 1, md:1 , lg:1} }}>
            <InputLabel sx={{p:{xs:1}}}>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={set('role')}>
              {ROLE_OPTIONS.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit" variant="contained" disabled={inviting}
            startIcon={inviting ? <CircularProgress size={14} color="inherit" /> : <PersonAdd fontSize="small" />}
            sx={{ fontWeight: 600, borderRadius: 0.5, height:{xs:30, sm: 40}, alignSelf: 'stretch', mt: errors.full_name || errors.email ? 0 : 0 ,  p: {xs:0.5, sm: 1, md:1 , lg:1}  }}
          >
            {inviting ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

// ─── Edit Role Dialog ─────────────────────────────────────────────────────────

const EditRoleDialog = ({ user, onClose, onSaved, onError }) => {
  const [role, setRole]     = useState(user?.role ?? 'member');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateUser(user.id, { role });
      onSaved('User role updated successfully!');
      onClose();
    } catch (err) {
      onError(err.response?.data?.message ?? 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Edit Role</Typography>
      </DialogTitle>

      <DialogContent>
        {/* User summary */}
        <Stack direction="row" alignItems="center" gap={1.5} mb={3}
          sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
            {initials(user.full_name)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{user.full_name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
        </Stack>

        <FormControl fullWidth size="small">
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
            {ROLE_OPTIONS.map(({ value, label }) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}
          startIcon={<Close fontSize="small" />} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Check fontSize="small" />}
          sx={{ fontWeight: 600, borderRadius: 2 }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AdminUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const [search, setSearch]         = useState('');
  const [orderBy, setOrderBy]       = useState('full_name');
  const [order, setOrder]           = useState('asc');
  const [page, setPage]             = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_OPTIONS[0]);

  const [editTarget, setEditTarget] = useState(null);

  const successTimer = useRef(null);

  // ── Fetch ──
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.adminUsers();
      setUsers(data?.data ?? []);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Auto-dismiss success ──
  const showSuccess = (msg) => {
    setSuccess(msg);
    clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setSuccess(null), 4000);
  };

  useEffect(() => () => clearTimeout(successTimer.current), []);

  // ── Derived list ──
  const processed = (() => {
    const q = search.trim().toLowerCase();
    return [...users]
      .filter((u) =>
        !q ||
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
      )
      .sort(getComparator(order, orderBy));
  })();

  const paginated = processed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (col) => {
    setOrder(orderBy === col && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(col);
    setPage(0);
  };

  const handleEditSaved = (msg) => {
    showSuccess(msg);
    fetchUsers();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: { xs: 'flex', md: 'block', lg: 'block' }, flexDirection: 'column', gap: { xs: 3, md: 4 }}}>

      {/* ── Header ── */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <AdminPanelSettings color="primary" />
            <Typography variant="h5" sx={{fontWeight:{xs: 6000, sm: 700}}}>
              User Management
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            {loading ? 'Loading...' : `${processed.length} of ${users.length} users`}
          </Typography>
        </Box>

        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={fetchUsers} disabled={loading} size="small">
              <Refresh fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* ── Alerts ── */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}
          action={<Button size="small" color="inherit" onClick={fetchUsers}>Retry</Button>}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      )}

      {/* ── Invite form ── */}
      <InviteForm
        onSuccess={(msg) => { showSuccess(msg); fetchUsers(); }}
        onError={setError}
      />

      {/* ── Search bar ── */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Paper>

      {/* ── Table ── */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{
                      fontWeight: 700, fontSize: '0.72rem',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      color: 'text.secondary', bgcolor: 'grey.50', whiteSpace: 'nowrap',
                    }}
                  >
                    {col.sortable ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : 'asc'}
                        onClick={() => handleSort(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <LoadingRows cols={COLUMNS.length} />
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 7 }}>
                    <Typography variant="body2" color="text.secondary">
                      {search ? 'No users match your search.' : 'No users found.'}
                    </Typography>
                    {search && (
                      <Button size="small" sx={{ mt: 1 }} onClick={() => setSearch('')}>
                        Clear search
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    {/* User cell */}
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1.25}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main', flexShrink: 0 }}>
                          {initials(user.full_name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 160 }}>
                            {user.full_name || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {user.email}
                      </Typography>
                    </TableCell>

                    <TableCell><RoleChip role={user.role} /></TableCell>

                    <TableCell><StatusChip active={user.is_active} /></TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit role">
                        <IconButton size="small" onClick={() => setEditTarget(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
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
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        )}
      </Paper>

      {/* ── Edit dialog ── */}
      {editTarget && (
        <EditRoleDialog
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEditSaved}
          onError={setError}
        />
      )}
    </Box>
  );
};