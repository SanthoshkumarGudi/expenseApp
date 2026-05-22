import { useState, useEffect } from "react";
import { authService } from "../../lib/api";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import { set } from "zod";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const [editingUserData, setEditingUserData] = useState(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member",
  });
  const [inviting, setInviting] = useState(false);
  const formData = new FormData();
  formData.append("role", editingUserData?.role || "member");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.adminUsers();
      console.log("users data", data);
      setUsers(data.data || []);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);

      console.log("users state", users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("users state updated", users);
  }, [users]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.email) return;

    setInviting(true);
    try {
      await authService.inviteUser(inviteForm);
      setSuccess("Invitation sent successfully!");
      setInviteForm({ email: "", role: "member" });
      fetchUsers();
    } catch (err) {
      setError("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(true);
    setEditingUserData(user);
  };

  const handleEditConfirm = async () => {
    try {
      await authService.updateUser(editingUserData.id, {
        role: editingUserData.role,
      });
      setSuccess("User updated successfully!");
      setEditingUser(false);
      setEditingUserData(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setEditingUser(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Users
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Invite User Section */}
      <Box
        sx={{
          mb: 5,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Invite New User
        </Typography>

        <Box
          component="form"
          onSubmit={handleInvite}
          sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
        >
          <TextField
            label="Full Name"
            value={inviteForm.full_name}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, full_name: e.target.value })
            }
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Email Address"
            type="email"
            value={inviteForm.email}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, email: e.target.value })
            }
            required
            sx={{ minWidth: 250 }}
          />
          <Select
            value={inviteForm.role}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, role: e.target.value })
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Button type="submit" variant="contained" disabled={inviting}>
            {inviting ? "Sending..." : "Send Invite"}
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell align="center">
                    {/* Future action buttons (Edit, Deactivate, etc.) can go here */}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editingUser && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            backgroundColor: "#f0f0f0",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <Select
            fullWidth
            value={editingUserData?.role || "member"}
            onChange={(e) =>
              setEditingUserData({
                ...editingUserData,
                role: e.target.value,
              })
            }
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleEditConfirm}
          >
            Confirm Edit
          </Button>
        </Box>
      )}
      <Button variant="contained" sx={{ mt: 3 }} onClick={fetchUsers}>
        Refresh Users
      </Button>
    </Box>
  );
};
