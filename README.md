Role-Based Access Control (RBAC) UI
Overview
The RBAC UI project is an admin dashboard that allows administrators to manage users, roles, and permissions efficiently. It includes features like user management, role creation, permission assignment, and dynamic filtering/searching.

Features
User Management:

View, add, edit, and delete users.
Assign roles to users dynamically.
Manage user status (Active/Inactive).
Role Management:

Create, edit, and delete roles.
Assign permissions to roles dynamically.
Permissions Management:

Assign permissions to roles using a dynamic checkbox interface.
Search and Filters:

Search users by name or email.
Filter users by role or status.
Pagination:

Paginated user list for better navigation with large datasets.
API Integration:

Mock API using JSON Server for CRUD operations on users and roles.
Tech Stack
Frontend: React.js
Backend (Mock): JSON Server
Styling: CSS
API Handling: Axios
Installation
Step 1: Clone the Repository
bash
Copy code
git clone <repository-link>
cd rbac-ui
Step 2: Install Dependencies
Run the following command to install all required dependencies:

bash
Copy code
npm install
Step 3: Start the JSON Server
Ensure db.json exists in the root folder. Run the following command to start the JSON server:

bash
Copy code
npx json-server --watch db.json --port 3001
Step 4: Start the Frontend
In another terminal, run the React application:

bash
Copy code
npm start
Usage
Users Page:

Add/Edit users using the form.
Search users by name or email.
Filter users by role or status.
Delete users.
Roles Page:

Add/Edit roles using the form.
Assign permissions dynamically.
Delete roles.
Permissions Page:

Select a role and manage its permissions dynamically.
Project Structure
css
Copy code
src/
│
├── components/
│   ├── Sidebar.jsx
│   ├── TableComponent.jsx
│   ├── ProtectedRoute.jsx
│
├── pages/
│   ├── Users.jsx
│   ├── Roles.jsx
│   ├── Permissions.jsx
│   ├── Login.jsx
│
├── services/
│   ├── api.js
│
├── App.js
├── index.js
Sample Data
db.json
json
Copy code
{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "Admin", "status": "Active" },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "role": "Editor", "status": "Inactive" }
  ],
  "roles": [
    { "id": 1, "name": "Admin", "permissions": ["Read", "Write", "Delete"] },
    { "id": 2, "name": "Editor", "permissions": ["Read", "Write"] }
  ]
}
Screenshots
Include screenshots of the application for better visualization:

Users Management Page:
Highlight Add/Edit/Delete functionality.
Roles Management Page:
Show permissions assignment.
Permissions Page:
Display the dynamic permissions interface.
Future Enhancements
Sorting:
Add sorting capabilities for users and roles.
Authentication:
Implement role-based route protection.
Deployment:
Deploy the application on platforms like Netlify or Vercel.
Contribution
Feel free to fork the repository and contribute by submitting pull requests. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License.

