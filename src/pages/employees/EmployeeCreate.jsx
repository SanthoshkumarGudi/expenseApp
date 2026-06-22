import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { employeeService } from "../../lib/api";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem } from "@mui/material";

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [employeeTypes, setEmployeeTypes] = React.useState([]);

  useEffect(() => {
    const fetchEmplyeeTypes = async () => {
      try {
        const types = await employeeService.getEmployeeTypes();
        setEmployeeTypes(types);
      } catch (error) {
        console.error("Failed to fetch employee types:", error);
      }
    };

    fetchEmplyeeTypes();
  }, []);

  // const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      work_email: "",
      gender: "",
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
      system_role: "employee", // default value since it's required
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      work_email: Yup.string()
        .email("Invalid email")
        .required("Work email is required"),
      company_entity: Yup.string().required("Company entity is required"),
      work_location: Yup.string().required("Work location is required"),
      system_role: Yup.string().required("System role is required"),
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

        console.log("Submitting payload:", payload);
        await employeeService.createEmployee(payload);
        navigate("/employees/list");
      } catch (error) {
        // ADD THIS - logs the actual validation errors from FastAPI
        console.error("Error detail:", error.response?.data);
      }
    },
  });

  console.log("employment types are ", employeeTypes);

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create Employee
        </Typography>

        <Typography variant="body1" color="textSecondary" gutterBottom>
          Fill in the details below to add a new employee to your organization.
        </Typography>
      </Box>
      {/* formik will go here */}
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label="First Name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
            fullWidth
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
            fullWidth
          />

          <TextField
            label="Work Email"
            name="work_email"
            type="email"
            value={formik.values.work_email}
            onChange={formik.handleChange}
            error={
              formik.touched.work_email && Boolean(formik.errors.work_email)
            }
            helperText={formik.touched.work_email && formik.errors.work_email}
            fullWidth
          />

          <TextField
            select
            label="Gender"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            label="Mobile Number"
            name="mobile_number"
            value={formik.values.mobile_number}
            onChange={formik.handleChange}
            error={
              formik.touched.mobile_number &&
              Boolean(formik.errors.mobile_number)
            }
            helperText={
              formik.touched.mobile_number && formik.errors.mobile_number
            }
            fullWidth
          />

          <TextField
            label="Department"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            error={
              formik.touched.department && Boolean(formik.errors.department)
            }
            helperText={formik.touched.department && formik.errors.department}
            fullWidth
          />

          <TextField
            label="designation"
            name="designation"
            value={formik.values.designation}
            onChange={formik.handleChange}
            error={
              formik.touched.designation && Boolean(formik.errors.designation)
            }
            helperText={formik.touched.designation && formik.errors.designation}
            fullWidth
          />

          <TextField
            label="grade"
            name="grade"
            value={formik.values.grade}
            onChange={formik.handleChange}
            error={formik.touched.grade && Boolean(formik.errors.grade)}
            helperText={formik.touched.grade && formik.errors.grade}
            fullWidth
          />

          <TextField
            label="date_of_joining"
            name="date_of_joining"
            type="date"
            value={formik.values.date_of_joining}
            onChange={formik.handleChange}
            error={
              formik.touched.date_of_joining &&
              Boolean(formik.errors.date_of_joining)
            }
            helperText={
              formik.touched.date_of_joining && formik.errors.date_of_joining
            }
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="cost_centre"
            name="cost_centre"
            value={formik.values.cost_centre}
            onChange={formik.handleChange}
            error={
              formik.touched.cost_centre && Boolean(formik.errors.cost_centre)
            }
            helperText={formik.touched.cost_centre && formik.errors.cost_centre}
            fullWidth
          />

          <TextField
            select
            label="Employment Type"
            name="employment_type"
            value={formik.values.employment_type}
            onChange={formik.handleChange}
            error={
              formik.touched.employment_type &&
              Boolean(formik.errors.employment_type)
            }
            helperText={
              formik.touched.employment_type && formik.errors.employment_type
            }
            fullWidth
          >
            {employeeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="reporting_manager_id"
            name="reporting_manager_id"
            value={formik.values.reporting_manager_id}
            onChange={formik.handleChange}
            error={
              formik.touched.reporting_manager_id &&
              Boolean(formik.errors.reporting_manager_id)
            }
            helperText={
              formik.touched.reporting_manager_id &&
              formik.errors.reporting_manager_id
            }
            fullWidth
          />

          <TextField
            label="department_head_id"
            name="department_head_id"
            value={formik.values.department_head_id}
            onChange={formik.handleChange}
            error={
              formik.touched.department_head_id &&
              Boolean(formik.errors.department_head_id)
            }
            helperText={
              formik.touched.department_head_id &&
              formik.errors.department_head_id
            }
            fullWidth
          />

          <TextField
            label="Company Entity"
            name="company_entity"
            value={formik.values.company_entity}
            onChange={formik.handleChange}
            error={
              formik.touched.company_entity &&
              Boolean(formik.errors.company_entity)
            }
            helperText={
              formik.touched.company_entity && formik.errors.company_entity
            }
            fullWidth
          />

          <TextField
            label="Work Location"
            name="work_location"
            value={formik.values.work_location}
            onChange={formik.handleChange}
            error={
              formik.touched.work_location &&
              Boolean(formik.errors.work_location)
            }
            helperText={
              formik.touched.work_location && formik.errors.work_location
            }
            fullWidth
          />

          <TextField
            select
            label="System Role"
            name="system_role"
            value={formik.values.system_role}
            onChange={formik.handleChange}
            fullWidth
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            {/* add other SystemRole enum values as needed */}
          </TextField>

          <Button type="submit" variant="contained" fullWidth>
            Create Employee
          </Button>
        </Box>
      </form>
    </>
  );
}
