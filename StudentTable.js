import React, { useState, useCallback } from 'react';
import './student.css';
import { toast } from 'react-toastify';

const StudentTable = ({ next, previous }) => {
  const [rows, setRows] = useState([{
    sNo: 1,
    semester: 0,
    course: '',
    studentPresent: 0,
    lectureEngaged: 0,
    studentRoll: 0,
    averageAttendence: 0,
    averageOfColumn: 0,
    performanceFactor: 0,
    creditsEarned: 0,
    reportingOfficerOpinion: ''
  }]);

  const calculateAverageAttendance = useCallback((studentPresent, lectureEngaged, studentRoll) => {
    return ((studentPresent * 100) / (lectureEngaged * studentRoll)).toFixed(2);
  }, []);

  const calculatePerformanceFactor = useCallback((averageAttendence) => {
    if (averageAttendence >= 81) return 1.0;
    if (averageAttendence >= 61) return 0.7;
    if (averageAttendence >= 41) return 0.5;
    return 0.2;
  }, []);

  const calculateCreditsEarned = useCallback((performanceFactor) => {
    return (10 * performanceFactor).toFixed(2);
  }, []);

  const calculateAverageOfColumn = useCallback((rows) => {
    const totalAverageAttendance = rows.reduce((sum, row) => sum + parseFloat(row.averageAttendence || 0), 0);
    return (totalAverageAttendance / rows.length).toFixed(2);
  }, []);

  const handleInputChange = useCallback((index, field, value) => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [field]: value };

      if (['studentPresent', 'lectureEngaged', 'studentRoll'].includes(field)) {
        const { studentPresent, lectureEngaged, studentRoll } = newRows[index];
        if (studentPresent && lectureEngaged && studentRoll) {
          const averageAttendence = calculateAverageAttendance(
            parseFloat(studentPresent),
            parseFloat(lectureEngaged),
            parseFloat(studentRoll)
          );
          const performanceFactor = calculatePerformanceFactor(parseFloat(averageAttendence));
          const creditsEarned = calculateCreditsEarned(performanceFactor);

          newRows[index] = {
            ...newRows[index],
            averageAttendence,
            performanceFactor,
            creditsEarned
          };
        }
      }
      const averageOfColumn = calculateAverageOfColumn(newRows);
      return newRows.map(row => ({ ...row, averageOfColumn }));
    });
  }, [calculateAverageAttendance, calculatePerformanceFactor, calculateCreditsEarned, calculateAverageOfColumn]);

  const addRow = useCallback(() => {
    setRows(prevRows => [
      ...prevRows,
      {
        sNo: prevRows.length + 1,
        semester: 0,
        course: '',
        studentPresent: 0,
        lectureEngaged: 0,
        studentRoll: 0,
        averageAttendence: 0,
        averageOfColumn: 0,
        performanceFactor: 0,
        creditsEarned: 0,
        reportingOfficerOpinion: ''
      }
    ]);
  }, []);

  const deleteRow = useCallback((index) => {
    setRows(prevRows => {
      if (prevRows.length > 1) {
        const newRows = prevRows.filter((_, i) => i !== index);
        return newRows.map((row, i) => ({ ...row, sNo: i + 1 }));
      }
      return prevRows;
    });
  }, []);

  const validateData = useCallback(() => {
    for (const row of rows) {
      if (!row.semester || !row.course || !row.studentPresent || !row.lectureEngaged || !row.studentRoll) {
        toast.error('Please fill in all required fields for each row.');
        return false;
      }
    }
    return true;
  }, [rows]);

  const handleSubmit = useCallback(async () => {
    if (!validateData()) return;

    const payload = rows.map(row => ({
      ...row,
      semester: Number(row.semester),
      studentPresent: Number(row.studentPresent),
      lectureEngaged: Number(row.lectureEngaged),
      studentRoll: Number(row.studentRoll),
      averageAttendence: Number(row.averageAttendence),
    }));

    try {
      const response = await fetch('https://restartsihproject.onrender.com/api/addstudatt/Neha%20Patel', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(...payload)
      });
      
      if (response.ok) {
        toast.success("Data submitted successfully");
      } else {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit data. Please try again.');
    }
  }, [rows, validateData]);

  return (
    <div className="student-table-container">
      <h2 className="student-table-title"> Performance of Attendance of Students</h2>
      <div className="student-table-wrapper">
        <table className="student-performance-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Semester</th>
              <th>Name of Course</th>
              <th>Sum of Students present</th>
              <th>Lectures actually engaged (Th./Tu./PR/PRO)</th>
              <th>Students on roll.</th>
              <th>Average Attendance= (4)x100 / (5)x(6)</th>
              <th>Average of Column (7)</th>
              <th>Performance and Multiplying Factors</th>
              <th>Credits earned = 10*(8) /100</th>
              <th>Reporting Officer Opinion</th>
              {rows.length > 1 && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.sNo}</td>
                <td><input type="text" value={row.semester} onChange={(e) => handleInputChange(index, 'semester', e.target.value)} required /></td>
                <td><input type="text" value={row.course} onChange={(e) => handleInputChange(index, 'course', e.target.value)} required /></td>
                <td><input type="number" value={row.studentPresent} onChange={(e) => handleInputChange(index, 'studentPresent', e.target.value)} required /></td>
                <td><input type="number" value={row.lectureEngaged} onChange={(e) => handleInputChange(index, 'lectureEngaged', e.target.value)} required /></td>
                <td><input type="number" value={row.studentRoll} onChange={(e) => handleInputChange(index, 'studentRoll', e.target.value)} required /></td>
                <td><input type="number" value={row.averageAttendence} readOnly /></td>
                <td><input type="number" value={row.averageOfColumn} readOnly /></td>
                <td>
                  <div className="performance-factors">
                    <span>Excellent-1.0 (100-81)</span>
                    <span>Good-0.7 (80-61)</span>
                    <span>Average-0.5 (60-41)</span>
                    <span>Poor-0.2 (40-00)</span>
                  </div>
                  <input type="number" value={row.performanceFactor} readOnly />
                </td>
                <td><input type="number" value={row.creditsEarned} readOnly /></td>
                <td><input type="text" value={row.reportingOfficerOpinion} onChange={(e) => handleInputChange(index, 'reportingOfficerOpinion', e.target.value)} /></td>
                {rows.length > 1 && (
                  <td>
                    <button onClick={() => deleteRow(index)} className="student-table-btn student-table-btn-delete">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="student-table-button-container">
        <button onClick={addRow} className="student-table-btn student-table-btn-add">Add Row</button>
        <button onClick={handleSubmit} className="student-table-btn student-table-btn-submit">Submit</button>
      </div>
      <div className="student-table-navigation">
        <button onClick={previous} className="student-table-btn student-table-btn-nav">Previous</button>
        <button onClick={next} className="student-table-btn student-table-btn-nav">Next</button>
      </div>
    </div>
  );
};

export default StudentTable;