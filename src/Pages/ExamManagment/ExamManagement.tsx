// src/pages/ExamManagementPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../Results/Results.css'; // Assuming you have a CSS file for styling

const ExamManagement: React.FC = () => {
  // Dummy data for exams (replace with actual API calls later)
  const dummyExams = [
    { id: 'exam1', title: 'Mathematics Quiz', duration: 60, status: 'Published', totalQuestions: 10, totalMarks: 100 },
    { id: 'exam2', title: 'History Midterm', duration: 90, status: 'Draft', totalQuestions: 15, totalMarks: 150 },
    { id: 'exam3', title: 'Science Final', duration: 120, status: 'Published', totalQuestions: 20, totalMarks: 200 },
    { id: 'exam4', title: 'Programming Fundamentals', duration: 45, status: 'Archived', totalQuestions: 8, totalMarks: 80 },
  ];

  const handleDeleteExam = (id: string) => {
    if (window.confirm(`Are you sure you want to delete exam ${id}?`)) {
      console.log(`Deleting exam ${id}`);	
      // Implement API call to delete exam here
    }
  };

  const handlePublishToggle = (id: string, currentStatus: string) => {
    console.log(`Toggling publish status for exam ${id} to ${currentStatus === 'Published' ? 'Draft' : 'Published'}`);
    // Implement API call to update exam status here
  };


  return (
    <div className="page-container">
      <h1>Exam Management</h1>
      <p>Create, edit, and manage the lifecycle of your online exams.</p>

      <div className="action-bar">
        <Link to="/admin/contestcreator" className="button primary-button">Create New Exam</Link>
      </div>

      {dummyExams.length === 0 ? (
        <p>No exams created yet. Click "Create New Exam" to get started!</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration (min)</th>
              <th>Questions</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyExams.map((exam) => (
              <tr key={exam.id}>
                <td>
                  {/* Make title clickable to view details */}
                  <Link to={`/exams/${exam.id}`} className="table-title-link">
                    {exam.title}
                  </Link>
                </td>
                <td>{exam.duration}</td>
                <td>{exam.totalQuestions}</td>
                <td>{exam.totalMarks}</td>
                <td>{exam.status}</td>
                <td>
                  <button className="button secondary-button">Edit</button>
                  <button
                    className={`button ${exam.status === 'Published' ? 'warning-button' : 'success-button'}`}
                    onClick={() => handlePublishToggle(exam.id, exam.status)}
                  >
                    {exam.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="button danger-button" onClick={() => handleDeleteExam(exam.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamManagement;