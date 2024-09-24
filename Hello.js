import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import './Hello.css';
const Tables = ({ next, previous }) => {
  const [rows, setRows] = useState([
    { id: uuidv4(), semester: '', course: '', periodAllotted: '', periodEngaged: '', mfTeaching: 0.2, reportingOfficerOpinion: '' },
  ]);
  const [error, setError] = useState(null);

  const handleInputChange = (id, field, value) => {
    const updatedValue = ['periodAllotted', 'periodEngaged'].includes(field) ? parseFloat(value) || '' : value;
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: updatedValue } : row
    ));
  };

  const calculatePercentageAchieved = (periodEngaged, periodAllotted) => {
    if (!periodEngaged || !periodAllotted) return '';
    return ((periodEngaged / periodAllotted) * 100).toFixed(2);
  };

  const calculateCreditsEarned = (percentageAchieved, mfTeaching) => {
    if (!percentageAchieved) return '';
    return (20 * (parseFloat(percentageAchieved) / 100) * mfTeaching).toFixed(2);
  };

  const handleSubmitRow = async (row) => {
    if (!row.semester || !row.course || !row.periodAllotted || !row.periodEngaged) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const { id, ...rowData } = row;
      const dataToSend = {
        semester: rowData.semester,
        course: rowData.course,
        periodsAllotted: parseInt(rowData.periodAllotted, 10),
        periodEngaged: parseInt(rowData.periodEngaged, 10),
        mfTeaching: parseFloat(rowData.mfTeaching),
        reportingOfficerOpinion: rowData.reportingOfficerOpinion || 'good'
      };

      const apiUrl = `https://restartsihproject.onrender.com/api/addlecture/Neha%20Patel`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        setError(null);
        toast.success("Data submitted successfully");
      } else {
        toast.error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting row data:', error);
      setError(`An error occurred while submitting row data: ${error.message}`);
    }
  };

  const addRow = () => {
    setRows([...rows, { id: uuidv4(), semester: '', course: '', periodAllotted: '', periodEngaged: '', mfTeaching: 0.2, reportingOfficerOpinion: '' }]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <div className="tables-container">
      <h2 className="tables-heading">Performance Of Engaging Lectures</h2>
      <div className="tables-main">
        <h3 className="tables-subheading">For Even/Odd Lectures</h3>
        {error && <div className="tables-error-message">{error}</div>}
        <div className="tables-wrapper">
          <table className="tables-content">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Semester</th>
                <th>Name of Course</th>
                <th>No. of Total Periods Allotted per semester*</th>
                <th>Nos. actually engaged (Th./Tu./PR/PRO)</th>
                <th>% Target Achieved =(5)/(4)</th>
                <th>M.F. for teaching no. of subject</th>
                <th>Credits earned = 20* (8) /100</th>
                <th>Reporting Officer Opinion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td className='tabledata'>
                    <input
                      type="text"
                      value={row.semester}
                      onChange={(e) => handleInputChange(row.id, 'semester', e.target.value)}
                      required
                    />
                  </td>
                  <td className='tabledata'>
                    <input
                      type="text"
                      value={row.course}
                      onChange={(e) => handleInputChange(row.id, 'course', e.target.value)}
                      required
                    />
                  </td>
                  <td className='tabledata'>
                    <input
                      type="number"
                      value={row.periodAllotted}
                      onChange={(e) => handleInputChange(row.id, 'periodAllotted', e.target.value)}
                      required
                    />
                  </td>
                  <td className='tabledata'>
                    <input
                      type="number"
                      value={row.periodEngaged}
                      onChange={(e) => handleInputChange(row.id, 'periodEngaged', e.target.value)}
                      required
                    />
                  </td>
                  <td className='tabledata'>
                    {calculatePercentageAchieved(row.periodEngaged, row.periodAllotted)}
                  </td>
                  <td>{row.mfTeaching.toFixed(2)}</td>
                  <td className='tabledata'>
                    {calculateCreditsEarned(
                      calculatePercentageAchieved(row.periodEngaged, row.periodAllotted),
                      row.mfTeaching
                    )}
                  </td>
                  <td className='tabledata'>
                    <input
                      type="text"
                      value={row.reportingOfficerOpinion}
                      onChange={(e) => handleInputChange(row.id, 'reportingOfficerOpinion', e.target.value)}
                    />
                  </td>
                  <td className="tables-actions">
                    <button onClick={() => handleSubmitRow(row)} className="tables-button tables-submit">Submit</button>
                    {index === rows.length - 1 && <button onClick={addRow} className="tables-button tables-add">Add Row</button>}
                    {index !== 0 && <button onClick={() => deleteRow(row.id)} className="tables-button tables-delete">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tables-navigation">
        <button onClick={previous} className="tables-button tables-nav">Previous</button>
        <button onClick={next} className="tables-button tables-nav">Next</button>
      </div>
    </div>
  );
};

export default Tables;