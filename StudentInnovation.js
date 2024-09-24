import React, { useState, useEffect } from 'react';
import './StudentInnovation.css';

const StudentProjectGuidanceForm = ({ previous }) => {
  const [projects, setProjects] = useState([]);
  const [innovation, setInnovation] = useState('');
  const [reportingOfficerOpinion, setReportingOfficerOpinion] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now(),
      name: '',
      funding: '',
      duration: '',
      cost: '',
      credits: ''
    }]);
  };

  const handleProjectChange = (id, field, value) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  useEffect(() => {
    calculateTotalCredits();
  }, [projects, innovation]);

  const calculateTotalCredits = () => {
    let projectCredits = projects.reduce((sum, project) => sum + parseFloat(project.credits || 0), 0);
    projectCredits = Math.min(projectCredits, 6);
    const innovationCredits = innovation.trim() !== '' ? 4 : 0;
    setTotalCredits(projectCredits + innovationCredits);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      projects,
      innovation,
      reportingOfficerOpinion,
      totalCredits
    };
    console.log("Submitting data:", formData);
    // Here you would send the data to your server
  };

  return (
    <div className='parentinno'> 
    <div className="spg-form-wrapper">
      <div className="spg-form-container">
        <h1 className="spg-form-header"> Guidance and Innovation in Student's Major Project Work</h1>
        
        <form onSubmit={handleSubmit} className="spg-form">
          <h2 className="spg-form-subheader">4.1 Projects guided (Maximum 6 Credits, 2 for each project):</h2>
          <table className="spg-form-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name of Projects</th>
                <th>Internal/External Funding</th>
                <th>Duration</th>
                <th>Project Cost</th>
                <th>Credits earned</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td><input type="text" value={project.name} onChange={(e) => handleProjectChange(project.id, 'name', e.target.value)} className="spg-form-input" /></td>
                  <td><input type="text" value={project.funding} onChange={(e) => handleProjectChange(project.id, 'funding', e.target.value)} className="spg-form-input" /></td>
                  <td><input type="text" value={project.duration} onChange={(e) => handleProjectChange(project.id, 'duration', e.target.value)} className="spg-form-input" /></td>
                  <td><input type="text" value={project.cost} onChange={(e) => handleProjectChange(project.id, 'cost', e.target.value)} className="spg-form-input" /></td>
                  <td><input type="number" max="2" value={project.credits} onChange={(e) => handleProjectChange(project.id, 'credits', e.target.value)} className="spg-form-input" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addProject} className="spg-form-button spg-form-add-button">Add Project</button>

          <h2 className="spg-form-subheader">4.2 Innovation brought out in Project Work: (Maximum 4 Credits)</h2>
          <textarea 
            value={innovation} 
            onChange={(e) => setInnovation(e.target.value)}
            placeholder="Please Specify"
            className="spg-form-textarea"
          />

          <h2 className="spg-form-subheader">Reporting Officer's Opinion</h2>
          <textarea 
            value={reportingOfficerOpinion} 
            onChange={(e) => setReportingOfficerOpinion(e.target.value)}
            className="spg-form-textarea"
          />

          <p className="spg-form-total-credits">Total Credits: {totalCredits}</p>
          <button type="submit" className="spg-form-button spg-form-submit-button">Submit</button>
        </form>
      </div>
      <div className="spg-form-navigation">
        <button onClick={previous} className="spg-form-button spg-form-nav-button previousbutton">
          Previous
        </button>
      </div>
    </div></div>
  );
};

export default StudentProjectGuidanceForm;