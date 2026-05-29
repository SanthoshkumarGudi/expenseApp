// ==================== src/components/profile/Profile.jsx ====================
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../lib/api';
import { 
  Box, Typography, TextField,  CircularProgress, 
  Alert, Avatar, Stack, Paper, IconButton 
} from '@mui/material';
import { Edit, Logout } from '@mui/icons-material';
import { Container } from '@mui/system';
import { Button } from '../common/Button';


export const Profile = () => {
  const { user, loadUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar: null,
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
      });
      setPreviewAvatar(user.avatar_url);
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError(null);

  try {
    const updateData = {
      full_name: formData.full_name,
      phone: formData.phone || null,
    };

    console.log("Sending update:", updateData);

    await authService.updateProfile(updateData);   // ← Send as object (JSON)

    await loadUserProfile(); // Refresh user data
    setSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSuccess(false), 3000);
  } catch (err) {
    console.error("Update Error:", err.response?.data);
    setError(
      err.response?.data?.detail?.[0]?.msg || 
      err.response?.data?.message || 
      "Failed to update profile"
    );
  } finally {
    setSaving(false);
  }
};

  if (loading || !user) return <CircularProgress sx={{ mt: 4 }} />;

  // const handleLogout = async () => {
  //   console.log("Logging out user...");
  //   await authService.logout();
  //   window.location.href = "/auth";
  // };

  console.log("user data in profile component is ", user);


  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 5, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between"  mb={4} flexWrap="wrap" alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            My Profile
          </Typography>
        </Stack>
       

        {success && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack alignItems="center" spacing={3} mb={5}>
          <Avatar
            src={previewAvatar}
            sx={{ width: 140, height: 140, border: '4px solid', borderColor: 'primary.main' }}
          />
          {isEditing && (
            <Button variant="outlined" component="label">
              Change Avatar
              <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
            </Button>
          )}
        </Stack>

        {!isEditing ? (
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" color="text.secondary">FULL NAME</Typography>
              <Typography variant="h6">{user.full_name || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">EMAIL</Typography>
              <Typography variant="h6">{user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">PHONE</Typography>
              <Typography variant="h6">{user.phone || 'Not provided'}</Typography>
            </Box>
          </Stack>
        ) : (
          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Email Address"
                value={user.email}
                disabled
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />

              <Stack direction="row" spacing={2} mt={2}>
                <Button type="submit" variant="contained" disabled={saving} >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)} fullWidth>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {!isEditing && (
          <Button 
            variant="contained" 
            startIcon={<Edit />} 
            onClick={() => setIsEditing(true)}
            sx={{ mt: 4 }}
            
          >
            Edit Profile
          </Button>
        )}
      </Paper>
    </Container>
  );
};