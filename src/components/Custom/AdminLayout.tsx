import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css'; 

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Exam Admin</h3>
        </div>
        <ul className="sidebar-menu">
          <li>
            {/* <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? 'active' : ''}>
              Dashboard
            </Link> */}
          </li>
          <li>
            <Link to="/admin/exammanagement" className={isActive('/admin/exams') ? 'active' : ''}>
              Exams
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/results" className={isActive('/admin/results') ? 'active' : ''}>
              Results
            </Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
