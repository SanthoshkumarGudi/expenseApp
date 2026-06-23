import React, { useEffect } from "react";
import { Box, Typography, TextField, MenuItem } from "@mui/material";
import { employeeService } from "../../lib/api";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [employeeTypes, setEmployeeTypes] = React.useState([]);

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        const types = await employeeService.getEmployeeTypes();
        setEmployeeTypes(types);
      } catch (error) {
        console.error("Failed to fetch employee types:", error);
      }
    };
    fetchEmployeeTypes();
  }, []);

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
      first_name:     Yup.string().required("First name is required"),
      last_name:      Yup.string().required("Last name is required"),
      work_email:     Yup.string().email("Invalid email").required("Work email is required"),
      mobile_number:  Yup.string().required("Mobile number is required"),
      department:     Yup.string().required("Department is required"),
      designation:    Yup.string().required("Designation is required"),
      grade:          Yup.string().required("Grade is required"),
      date_of_joining: Yup.string().required("Date of joining is required"),
      cost_centre:    Yup.string().required("Cost centre is required"),
      company_entity: Yup.string().required("Company entity is required"),
      work_location:  Yup.string().required("Work location is required"),
      system_role:    Yup.string().required("System role is required"),
      gender:         Yup.string().required("Gender is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
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
        await employeeService.createEmployee(payload);
        navigate("/employees/list");
      } catch (error) {
        console.error("Error detail:", error.response?.data);
      }
    },
  });

  const field = (name) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[name] && Boolean(formik.errors[name]),
    helperText: formik.touched[name] && formik.errors[name],
    fullWidth: true,
  });

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create employee
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the details below to add a new employee to your organization.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {/* Personal */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1 }}>
          Personal details
        </Typography>

        <TextField label="First name"    {...field("first_name")} />
        <TextField label="Last name"     {...field("last_name")} />
        <TextField label="Work email"    {...field("work_email")} type="email" />
        <TextField label="Mobile number" {...field("mobile_number")} />

        <TextField select label="Gender" {...field("gender")}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        {/* Organization */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: -1 }}>
          Organization details
        </Typography>

        <TextField label="Department"    {...field("department")} />
        <TextField label="Designation"   {...field("designation")} />
        <TextField label="Grade"         {...field("grade")} />
        <TextField label="Cost centre"   {...field("cost_centre")} />
        <TextField label="Company entity" {...field("company_entity")} />
        <TextField label="Work location" {...field("work_location")} />

        <TextField
          label="Date of joining"
          type="date"
          {...field("date_of_joining")}
          InputLabelProps={{ shrink: true }}
        />

        <TextField select label="Employment type" {...field("employment_type")}>
          {employeeTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* Access & Hierarchy */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: -1 }}>
          Access & hierarchy
        </Typography>

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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ px: 3, py: 1 }}
          >
            Create employee
          </Button>
        </Box>
      </Box>
    </Box>
  );
}