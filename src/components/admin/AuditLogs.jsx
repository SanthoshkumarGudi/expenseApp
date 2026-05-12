import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { authService } from '../../lib/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    event_type: '',
    start_date: '',
    end_date: ''
  });

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // Note: You may need to implement this endpoint in backend if not present
      // For now assuming /audit-logs endpoint
      const response = await authService.getAuditLogs?.() || 
        // Fallback mock data for testing
        { data: [
          { id: 1, event_type: 'login_success', user_email: 'admin@company.com', ip_address: '192.168.1.1', created_at: '2026-05-07T10:30:00' },
          { id: 2, event_type: 'login_fail', user_email: 'user@company.com', ip_address: '192.168.1.5', created_at: '2026-05-07T09:15:00' },
          { id: 3, event_type: 'password_change', user_email: 'admin@company.com', ip_address: '192.168.1.1', created_at: '2026-05-06T14:20:00' },
        ]};

      setLogs(response.data || response);
    } catch (err) {
      setError("Failed to load audit logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const getEventColor = (type) => {
    if (type.includes('success')) return 'success.main';
    if (type.includes('fail')) return 'error.main';
    if (type.includes('change')) return 'warning.main';
    return 'text.primary';
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Audit Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track all authentication and security events
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={filter.event_type}
            label="Event Type"
            onChange={(e) => setFilter({ ...filter, event_type: e.target.value })}
          >
            <MenuItem value="">All Events</MenuItem>
            <MenuItem value="login_success">Login Success</MenuItem>
            <MenuItem value="login_fail">Login Failed</MenuItem>
            <MenuItem value="password_change">Password Change</MenuItem>
            <MenuItem value="logout">Logout</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          value={filter.start_date}
          onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="End Date"
          type="date"
          value={filter.end_date}
          onChange={(e) => setFilter({ ...filter, end_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="outlined" onClick={fetchAuditLogs}>
          Apply Filters
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Timestamp</strong></TableCell>
              <TableCell><strong>Event</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>IP Address</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Typography color={getEventColor(log.event_type)} fontWeight="medium">
                    {log.event_type.replace('_', ' ').toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell>{log.user_email || 'System'}</TableCell>
                <TableCell>{log.ip_address || 'N/A'}</TableCell>
                <TableCell>{log.metadata ? JSON.stringify(log.metadata) : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {logs.length === 0 && !loading && (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>No audit logs found.</Typography>
      )}
    </Box>
  );
};