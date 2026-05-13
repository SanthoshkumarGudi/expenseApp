import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../lib/api';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Avatar } from '@mui/material';

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

  const handleLogout = async () => {
    console.log("Logging out user...");
    await authService.logout();
    window.location.href = "/auth";
  };

  console.log("user data in profile component is ", user);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>
      <Box sx={{ mb: 2 }}>
       
        <Button variant="text" onClick={handleLogout}>
          logout
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>Profile updated successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Avatar */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          src={previewAvatar}
          sx={{ width: 120, height: 120, mx: 'auto', border: '3px solid #1976d2' }}
        />
        {isEditing && (
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Change Avatar
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>
        )}
      </Box>

      {!isEditing ? (
        /* Display Mode */
        <Box sx={{ mt: 3, lineHeight: 2.5 }}>
          <Typography><strong>Full Name:</strong> {user.full_name || 'N/A'}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Typography><strong>Phone:</strong> {user.phone || 'Not provided'}</Typography>
          {/* <Typography><strong>Role:</strong> {user.role || 'member'}</Typography> */}
          {/* <Typography><strong>2FA:</strong> {user.totp_enabled ? 'Enabled' : 'Disabled'}</Typography> */}
        </Box>
      ) : (
        /* Edit Mode */
        <Box component="form" onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email Address"
            value={user.email}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            margin="normal"
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {!isEditing && (
        <Button 
          variant="contained" 
          sx={{ mt: 4 }} 
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
};