import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import './perform.css';
const PerformanceResultTable = ({ next, previous }) => {
  const [rows, setRows] = useState([
    { 
      id: uuidv4(), 
      semester: 0, 
      course: '', 
      averageResult: 0, 
      averageOfColumn4: '', 
      performanceFactors: '', 
      creditsEarned: '', 
      reportingOfficerOpinion: '' 
    },
  ]);

  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (field === 'averageOfColumn4') {
          updatedRow.creditsEarned = calculateCreditsEarned(value);
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const calculateCreditsEarned = (averageOfColumn4) => {
    if (!averageOfColumn4) return '';
    const factor = averageOfColumn4 >= 81 ? 1.0 :
                   averageOfColumn4 >= 61 ? 0.7 :
                   averageOfColumn4 >= 41 ? 0.5 : 0.2;
    return (10 * factor).toFixed(2);
  };

  const handleSubmit = async (id) => {
    const rowData = rows.find(row => row.id === id);
    const dataToSubmit = {
      semester: parseInt(rowData.semester),
      course: rowData.course,
      averageResult: parseFloat(rowData.averageResult)
    };
    console.log('Submitting data:', dataToSubmit);

    try {
      const response = await fetch('https://restartsihproject.onrender.com/api/addresult/Neha%20Patel', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit)
      });
      if(response.ok){
        toast.success("Data submitted successfully");
      } else {
        toast.error('Failed to submit');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addRow = () => {
    setRows([...rows, { 
      id: uuidv4(), 
      semester: 0, 
      course: '', 
      averageResult: 0, 
      averageOfColumn4: '', 
      performanceFactors: '', 
      creditsEarned: '', 
      reportingOfficerOpinion: '' 
    }]);
  };

  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {
      alert("Cannot delete the only row. At least one row must remain.");
    }
  };

  return (
    <div className="performance-form">
      <h2 className="performance-heading">Performance of the Result</h2>
      <div className="performance-table-wrapper">
        <table className="performance-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Semester</th>
              <th>Name of Course</th>
              <th>Average Result of the in year</th>
              <th>Average of Column (4)</th>
              <th>Performance and Multiplying Factors</th>
              <th>Credits earned = 10*(6)</th>
              <th>Reporting Officer Opinion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="number"
                    value={row.semester}
                    onChange={(e) => handleInputChange(row.id, 'semester', e.target.value)}
                    className="performance-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.course}
                    onChange={(e) => handleInputChange(row.id, 'course', e.target.value)}
                    className="performance-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.averageResult}
                    onChange={(e) => handleInputChange(row.id, 'averageResult', e.target.value)}
                    className="performance-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.averageOfColumn4}
                    onChange={(e) => handleInputChange(row.id, 'averageOfColumn4', e.target.value)}
                    className="performance-input"
                  />
                </td>
                <td className="performance-factors">
                  <span>Excellent-1.0 (100-81)</span>
                  <span>Good-0.7 (80-61)</span>
                  <span>Average-0.5 (60-41)</span>
                  <span>Poor-0.2 (40-00)</span>
                </td>
                <td>{row.creditsEarned}</td>
                <td>
                  <input
                    type="text"
                    value={row.reportingOfficerOpinion}
                    onChange={(e) => handleInputChange(row.id, 'reportingOfficerOpinion', e.target.value)}
                    className="performance-input"
                  />
                </td>
                <td>
                  <div className="performance-action-buttons">
                    <button type="button" className="performance-btn performance-btn-submit" onClick={() => handleSubmit(row.id)}>
                      <Send size={18} />
                    </button>
                    <button type="button" className="performance-btn performance-btn-delete" onClick={() => deleteRow(row.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="performance-button-container">
        <button type="button" className="performance-btn performance-btn-add" onClick={addRow}>
          <Plus size={18} /> Add Row
        </button>
      </div>
      <div className="performance-navigation">
        <button onClick={previous} className="performance-btn performance-btn-nav">
          Previous
        </button>
        <button onClick={next} className="performance-btn performance-btn-nav">
          Next
        </button>
      </div>
    </div>
  );
};

export default PerformanceResultTable;