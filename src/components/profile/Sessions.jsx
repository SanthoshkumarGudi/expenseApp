import { useState, useEffect } from 'react';
import { authService } from '../../lib/api';
import { Box, Typography, Button, CircularProgress, Alert, Divider } from '@mui/material';

export const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all active sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getSessions();
      setSessions(Array.isArray(data) ? data : data.sessions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load active sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Terminate a specific session
  const handleTerminate = async (sessionId) => {
    if (!window.confirm("Are you sure you want to terminate this session?")) {
      return;
    }

    try {
      await authService.terminateSession(sessionId);
      await fetchSessions(); // Refresh the list
      alert("Session terminated successfully.");
    } catch (err) {
      alert("Failed to terminate session. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Active Sessions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your active login sessions across different devices
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4 }}>
          No active sessions found.
        </Typography>
      ) : (
        sessions.map((session) => (
          <Box
            key={session.id}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {session.device_name || 'Unknown Device'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {session.ip_address} • {session.device_type || 'web'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Active: {session.last_active_at 
                  ? new Date(session.last_active_at).toLocaleString() 
                  : 'Unknown'}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={() => handleTerminate(session.id)}
            >
              Terminate Session
            </Button>
          </Box>
        ))
      )}

      <Divider sx={{ my: 4 }} />

      <Button variant="contained" onClick={fetchSessions}>
        Refresh Sessions
      </Button>
    </Box>
  );
};