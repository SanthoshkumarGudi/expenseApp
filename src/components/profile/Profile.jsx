import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../lib/api';
import {
  Box, Typography, TextField, CircularProgress,
  Alert, Avatar, Stack, Paper, Chip,
  IconButton, Tooltip, Skeleton,
  Grid,
} from '@mui/material';
import {
  Edit, CameraAlt, Close, Check,
  Person, Email, Phone, Badge,
} from '@mui/icons-material';
import { Container } from '@mui/material';
import { Button } from '../common/Button';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'U';

const formatRole = (role = '') =>
  role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, placeholder = 'Not provided' }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      py: 1.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&:last-of-type': { borderBottom: 0 },
    }}
  >
    {/* Icon pill */}
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1,
        bgcolor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: 'text.secondary',
        mt: 0.25,
      }}
    >
      {icon}
    </Box>

    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        fontWeight={600}
        letterSpacing="0.07em"
        textTransform="uppercase"
        color="text.disabled"
        display="block"
        mb={0.25}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color={value ? 'text.primary' : 'text.disabled'}
        fontStyle={value ? 'normal' : 'italic'}
      >
        {value || placeholder}
      </Typography>
    </Box>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const Profile = () => {
  const { user, loadUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState(null);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: null,
  });

  // ── Sync form when user loads ──
  useEffect(() => {
    if (user) {
      setFormData({ full_name: user.full_name ?? '', phone: user.phone ?? '', avatar_url: null });
      setPreviewAvatar(user.avatar_url ?? null);
      setLoading(false);
    }
  }, [user]);

  // ── Avatar upload ──
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFieldErrors((p) => ({ ...p, avatar: 'Only JPEG, PNG, or WebP images are allowed.' }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFieldErrors((p) => ({ ...p, avatar: `Image must be under ${MAX_FILE_SIZE_MB} MB.` }));
      return;
    }

    setFieldErrors((p) => ({ ...p, avatar: undefined }));
    setFormData((p) => ({ ...p, avatar_url: file }));
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required.';
    if (formData.phone && !/^\+?[\d\s\-().]{7,20}$/.test(formData.phone))
      errs.phone = 'Enter a valid phone number.';
    return errs;
  };

  // ── Cancel ──
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
    setFieldErrors({});
    setFormData({ full_name: user?.full_name ?? '', phone: user?.phone ?? '', avatar_url: null });
    setPreviewAvatar(user?.avatar_url ?? null);
  }, [user]);

  // ── Submit ──
  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      await authService.updateProfile({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        avatar: formData.avatar_url instanceof File ? formData.avatar_url : null,
      });
      await loadUserProfile();
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail) ? detail[0]?.msg :
        err.response?.data?.message ??
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────

  if (loading || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Header skeleton */}
          <Box sx={{ px: { xs: 3, md: 5 }, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Skeleton width={120} height={24} />
            <Skeleton width={200} height={16} sx={{ mt: 0.5 }} />
          </Box>
          {/* Avatar row skeleton */}
          <Box sx={{ px: { xs: 3, md: 5 }, py: 2.5, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="circular" width={68} height={68} />
            <Box>
              <Skeleton width={140} height={20} />
              <Skeleton width={180} height={16} sx={{ mt: 0.5 }} />
              <Skeleton width={60} height={22} sx={{ mt: 0.75, borderRadius: 10 }} />
            </Box>
          </Box>
          {/* Field skeletons */}
          <Box sx={{ px: { xs: 3, md: 5 } }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ py: 1.5, display: 'flex', gap: 1.5, alignItems: 'flex-start', borderBottom: i < 4 ? '1px solid' : 0, borderColor: 'divider' }}>
                <Skeleton variant="rounded" width={32} height={32} />
                <Box>
                  <Skeleton width={60} height={12} />
                  <Skeleton width={160} height={18} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>

        {/* ── Success bar ── */}
        {success && (
          <Alert
            severity="success"
            icon={<Check fontSize="small" />}
            sx={{ borderRadius: 0, border: 0, borderBottom: '1px solid', borderColor: 'success.light' }}
          >
            Profile updated successfully.
          </Alert>
        )}

        {/* ── Header band ── */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600} letterSpacing="-0.3px">
              My Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your personal information
            </Typography>
          </Box>

          {!isEditing && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit fontSize="small" />}
              onClick={() => setIsEditing(true)}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* ── Avatar + identity row ── */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Avatar with camera overlay */}
          <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            <Tooltip title={user.full_name} arrow>
              <Avatar
                src={previewAvatar}
                sx={{
                  width: 68,
                  height: 68,
                  fontSize: 22,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  border: '3px solid',
                  borderColor: 'primary.light',
                }}
              >
                {initials(user.full_name)}
              </Avatar>
            </Tooltip>

            {isEditing && (
              <Tooltip title="Change photo">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 26,
                    height: 26,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <CameraAlt sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleAvatarChange}
            />
          </Box>

          {/* Name / email / role */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} lineHeight={1.3}>
              {user.full_name || '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.25}>
              {user.email}
            </Typography>
            <Chip
              label={formatRole(user.role)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.75, fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>

          {/* Avatar error */}
          {fieldErrors.avatar && (
            <Alert
              severity="error"
              sx={{ py: 0.5, flex: '1 1 100%', borderRadius: 2 }}
              onClose={() => setFieldErrors((p) => ({ ...p, avatar: undefined }))}
            >
              {fieldErrors.avatar}
            </Alert>
          )}
        </Box>

        {/* ── Body ── */}
        <Box sx={{ px: { xs: 3, md: 5 }, py: 3 }}>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* ── View mode ── */}
          {!isEditing ? (
            <Box>
              <InfoRow icon={<Person fontSize="small" />} label="Full Name"    value={user.full_name} />
              <InfoRow icon={<Email fontSize="small" />}  label="Email"        value={user.email} />
              <InfoRow icon={<Phone fontSize="small" />}  label="Phone"        value={user.phone} />
              <InfoRow icon={<Badge fontSize="small" />}  label="Account Role" value={formatRole(user.role)} />
            </Box>
          ) : (
            /* ── Edit mode ── */
            <Box component="form" onSubmit={handleSave} noValidate>
              <Grid container spacing={2.5}>

                {/* Full name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                    error={!!fieldErrors.full_name}
                    helperText={fieldErrors.full_name}
                    required
                    autoFocus
                    size="small"
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone || 'Include country code, e.g. +91 98765 43210'}
                    placeholder="+91 98765 43210"
                    size="small"
                  />
                </Grid>

                {/* Email (read-only) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={user.email}
                    disabled
                    helperText="Email cannot be changed here."
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>

                {/* Actions */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} pt={0.5} flexWrap="wrap">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      startIcon={
                        saving
                          ? <CircularProgress size={14} color="inherit" />
                          : <Check fontSize="small" />
                      }
                      sx={{ fontWeight: 600, borderRadius: 2, minWidth: 140 }}
                    >
                      {saving ? 'Saving…' : 'Save Changes'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                      startIcon={<Close fontSize="small" />}
                      sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Grid>

              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};