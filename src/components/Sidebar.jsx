import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Add a CSS file for styling the sidebar

const Sidebar = ({ role }) => {
  // Define menu items based on roles
  const menuItems = {
    Admin: [
      { path: '/users', label: 'Users' },
      { path: '/roles', label: 'Roles' },
      { path: '/permissions', label: 'Permissions' },
      { path: '/activity-logs', label: 'Activity Logs' }, // Add Activity Logs for Admins
      { path: '/permission-matrix', label: 'Permissions Matrix' },

    ],
    Editor: [
      { path: '/roles', label: 'Roles' },
    ],
    Viewer: [
      { path: '/users', label: 'Users' },
    ],
  };

  return (
    <div className="sidebar">
      <nav>
        <ul className="sidebar-list">
          {menuItems[role]?.map((item, index) => (
            <li key={index} className="sidebar-item">
              <Link to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
