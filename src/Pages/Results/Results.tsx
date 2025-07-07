import React from 'react';
import { Link } from 'react-router-dom';
import './Results.css'; 
import { VenusAndMarsIcon } from 'lucide-react';

const Results: React.FC = () => {
    // Dummy data for exams that have results (replace with actual API calls later)
    const dummyExamsWithResults = [
        { id: 'exam1', title: 'Mathematics Quiz', completedAttempts: 5, averageScore: 75 },
        { id: 'exam3', title: 'Science Final', completedAttempts: 2, averageScore: 82 },
    ];

    return (
        <div className="page-container">
            <h1>Exam Results Overview</h1>
            <p>Select an exam to view detailed results for all attempts.</p>

            {dummyExamsWithResults.length === 0 ? (
                <p>No exams with completed attempts yet.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Exam Title</th>
                            <th>Completed Attempts</th>
                            <th>Average Score</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyExamsWithResults.map((exam) => (
                            <tr key={exam.id}>
                                <td>{exam.title}</td>
                                <td>{exam.completedAttempts}</td>
                                <td>{exam.averageScore}%</td>
                                <td>
                                    <Link to={`/results/${exam.id}`} className="button primary-button">View Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Results;
