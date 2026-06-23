import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { employeeService } from "../../lib/api";
import { Button } from "../../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EmployeeEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      work_email: "",
      mobile_number: "",
      department: "",
      designation: "",
      grade: "",
      date_of_joining: "",
      employment_type: "",
      reporting_manager_id: "",
      department_head_id: "",
      cost_centre: "",
      company_entity: "",
      work_location: "",
      system_role: "employee",
      gender: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      work_email: Yup.string()
        .email("Invalid email")
        .required("Work email is required"),
      mobile_number: Yup.string().required("Mobile number is required"),
      department: Yup.string().required("Department is required"),
      designation: Yup.string().required("Designation is required"),
      grade: Yup.string().required("Grade is required"),
      date_of_joining: Yup.string().required("Date of joining is required"),
      cost_centre: Yup.string().required("Cost centre is required"),
      company_entity: Yup.string().required("Company entity is required"),
      work_location: Yup.string().required("Work location is required"),
      system_role: Yup.string().required("System role is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    enableReinitialize: true, // allows pre-filling once data loads
    onSubmit: async (values) => {
      setSaveError(null);
      setSaveSuccess(false);
      try {
        const payload = {
          ...values,
          // This part in onSubmit must run correctly
          date_of_joining: values.date_of_joining || null,
          reporting_manager_id:
            values.reporting_manager_id === "" ||
            values.reporting_manager_id === "null"
              ? null
              : Number(values.reporting_manager_id),
          department_head_id:
            values.department_head_id === "" ||
            values.department_head_id === "null"
              ? null
              : Number(values.department_head_id),
        };
        await employeeService.updateEmployee(id, payload);
        setSaveSuccess(true);
        setTimeout(() => {
          navigate("/employees/list");
        }, 1200);
      } catch (error) {
        console.error("Update error:", error.response?.data);
        setSaveError(
          error.response?.data?.detail?.[0]?.msg ||
            error.response?.data?.message ||
            "Failed to update employee. Please try again.",
        );
      }
    },
  });

  // Fetch employee + types in parallel
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [employee, types] = await Promise.all([
          employeeService.getEmployee(id),
          employeeService.getEmployeeTypes(),
        ]);
        setEmployeeTypes(types);

        // Pre-fill form — normalize nulls to empty strings for controlled inputs
        formik.setValues({
          first_name: employee.first_name ?? "",
          last_name: employee.last_name ?? "",
          work_email: employee.work_email ?? "",
          mobile_number: employee.mobile_number ?? "",
          department: employee.department ?? "",
          designation: employee.designation ?? "",
          grade: employee.grade ?? "",
          date_of_joining: employee.date_of_joining ?? "",
          employment_type: employee.employment_type ?? "",
          reporting_manager_id:
            employee.reporting_manager_id != null
              ? String(employee.reporting_manager_id)
              : "",
          department_head_id:
            employee.department_head_id != null
              ? String(employee.department_head_id)
              : "",
          cost_centre: employee.cost_centre ?? "",
          company_entity: employee.company_entity ?? "",
          work_location: employee.work_location ?? "",
          system_role: employee.system_role ?? "employee",
          gender: employee.gender ?? "",
        });
      } catch (err) {
        setSaveError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Reusable field prop spreader
  const field = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
    fullWidth: true,
    disabled: loading,
  });

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <>
            <Skeleton width={220} height={36} />
            <Skeleton width={320} height={22} sx={{ mt: 0.5 }} />
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Edit employee
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the details for{" "}
              <strong>
                {formik.values.first_name} {formik.values.last_name}
              </strong>
            </Typography>
          </>
        )}
      </Box>

      {/* Alerts */}
      {saveError && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 3 }}
          onClose={() => setSaveError(null)}
        >
          {saveError}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
          Employee updated successfully! Redirecting…
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {/* ── Personal ── */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1 }}>
          Personal details
        </Typography>

        {loading ? (
          <>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </>
        ) : (
          <>
            <TextField label="First name" {...field("first_name")} />
            <TextField label="Last name" {...field("last_name")} />
            <TextField
              label="Work email"
              {...field("work_email")}
              type="email"
            />
            <TextField label="Mobile number" {...field("mobile_number")} />
            <TextField select label="Gender" {...field("gender")}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </>
        )}

        {/* ── Organization ── */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mt: 1, mb: -1 }}
        >
          Organization details
        </Typography>

        {loading ? (
          <>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </>
        ) : (
          <>
            <TextField label="Department" {...field("department")} />
            <TextField label="Designation" {...field("designation")} />
            <TextField label="Grade" {...field("grade")} />
            <TextField label="Cost centre" {...field("cost_centre")} />
            <TextField label="Company entity" {...field("company_entity")} />
            <TextField label="Work location" {...field("work_location")} />
            <TextField
              label="Date of joining"
              type="date"
              {...field("date_of_joining")}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              label="Employment type"
              {...field("employment_type")}
            >
              {employeeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {/* ── Access & Hierarchy ── */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mt: 1, mb: -1 }}
        >
          Access & hierarchy
        </Typography>

        {loading ? (
          <>
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
            <Skeleton variant="rounded" height={56} />
          </>
        ) : (
          <>
            <TextField select label="System role" {...field("system_role")}>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </TextField>
            <TextField
              label="Reporting manager ID"
              {...field("reporting_manager_id")}
              helperText={
                (formik.touched.reporting_manager_id &&
                  formik.errors.reporting_manager_id) ||
                "Leave blank if none"
              }
            />
            <TextField
              label="Department head ID"
              {...field("department_head_id")}
              helperText={
                (formik.touched.department_head_id &&
                  formik.errors.department_head_id) ||
                "Leave blank if none"
              }
            />
          </>
        )}

        {/* ── Actions ── */}
        <Box
          sx={{
            pt: 2,
            mt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/employees/list")}
            sx={{ px: 3, py: 1 }}
            disabled={formik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ px: 3, py: 1, minWidth: 140 }}
            disabled={loading || formik.isSubmitting}
            startIcon={
              formik.isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {formik.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
