import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Assessment.css';
import { toast } from 'react-toastify';
const formFields = [
  { id: uuidv4(), label: 'ASSESSMENT ACADEMIC YEAR', name: 'academicYear', type: 'number' },
  { id: uuidv4(), label: 'NAME OF FACULTY', name: 'facultyname', type: 'text' },
  { id: uuidv4(), label: 'POST', name: 'post', type: 'text' },
  { id: uuidv4(), label: 'PAY SCALE', name: 'payScale', type: 'number' },
  { id: uuidv4(), label: 'INSTITUTION', name: 'institution', type: 'text' },
  { id: uuidv4(), label: 'WORKING IN THIS INSTITUTION (YEARS)', name: 'workingInThisInstitution', type: 'number' },
  { id: uuidv4(), label: 'NAME AND DESIGNATION OF SECTIONAL HEAD (Institutional Level) (REPORTING OFFICER)', name: 'sectionalHead', type: 'text' },
  { id: uuidv4(), label: 'NAME AND DESIGNATION OF THE HEAD OF INSTITUTION (Principal/Director) (RECOMMENDING OFFICER)', name: 'institutionHead', type: 'text' },
  { id: uuidv4(), label: 'NAME AND DESIGNATION OF THE HEAD OF THE DEPARTMENT (Director, Technical Education) (FORWARDING OFFICER)', name: 'departmentHead', type: 'text' },
  { id: uuidv4(), label: 'NAME OF THE PRINCIPAL SECRETARY (ACCEPTING AUTHORITY)', name: 'secretary', type: 'text' }
];
const Assessment = ({ next }) => {
  const [formData, setFormData] = useState({
    academicYear: 0,
    facultyname: '',
    post: '',
    payScale: 0,
    institution: '',
    workingInThisInstitution: 0,
    sectionalHead: '',
    institutionHead: '',
    departmentHead: '',
    secretary: ''
  });
  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data to be sent to API:', formData);
    fetch('https://restartsihproject.onrender.com/api/addpartA/Neha%20Patel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        toast.success("Data Submitted successfully");
        return response.json();
      })
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className='parentcontainer'> 
    <div className="faf-wrapper">
      <div className="faf-container">
        <form onSubmit={handleSubmit} className="faf-form">
          <h2 className="faf-title">Faculty Assessment Form</h2>
          {formFields.map((field) => (
            <div key={field.id} className="faf-form-group">
              <label htmlFor={field.name} className="faf-label">{field.label}</label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                required
                className="faf-input"
              />
            </div>
          ))}
          <button type="submit" className="faf-submit-btn">Submit</button>
        </form>
      </div>
      <div className="faf-navigation">
        <button onClick={next} className="faf-next-btn">Next</button>
      </div>
    </div></div>
  );
};

export default Assessment;