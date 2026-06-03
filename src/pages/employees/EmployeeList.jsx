import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import employeeService from '../../lib/api';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        console.log("Fetch employees attempt completed.");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <input
        type="text"
        placeholder="Search by name, department, or role"
        onChange={(e) => {
          const query = e.target.value.toLowerCase();
          const filtered = employees.filter(
            (emp) =>
              emp.display_name.toLowerCase().includes(query) ||
              emp.work_email.toLowerCase().includes(query) ||
              emp.employee_id.toLowerCase().includes(query) ||
              emp.designation.toLowerCase().includes(query),
          );
          setEmployees(filtered);
        }}
      />
      <hr />
      {/* filter by grade, department, role, status */}
      <div>
        <label htmlFor="grade">Grade:</label>
        <select id="grade">
          <option value="">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
      </div>
      <div>
        <label htmlFor="department">Department:</label>
        <select id="department">
          <option value="">All</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select id="role">
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select id="status">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <>
            <li key={employee.id}>{employee.display_name}</li>
            <li key={employee.id}>{employee.department}</li>
            <li key={employee.id}>{employee.designation}</li>
            <li key={employee.id}>{employee.grade}</li>
            <li key={employee.id}>{employee.work_email}</li>
            <li key={employee.id}>{employee.mobile_number}</li>
            <li key={employee.id}>{employee.work_location}</li>
            <li key={employee.id}>{employee.system_role}</li>
            <li key={employee.id}>
              {employee.is_active ? "Active" : "Inactive"}
            </li>
            <li key={employee.id}>{employee.date_of_joining}</li>
            <li key={employee.id}>{employee.advance_block_flag}</li>
          </>
        ))}
      </ul>
    </>
  );
}
