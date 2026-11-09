# RentSure – Smart Rental Transparency & Deposit Protection System

**Making renting more transparent, secure, and accountable.**

RentSure is a smart rental management platform designed to improve transparency between tenants and landlords. It provides a centralized platform to manage rental properties, lease information, inspections, maintenance requests, and security deposits.

#  Key Features

- **Tenant Dashboard:** View rental information, lease details, inspections, and deposit status.
- **Landlord Dashboard:** Manage properties, monitor occupancy, and track rental activities.
- **Security Deposit Tracking:** Improve visibility into rental deposit information and settlements.
- **Property Management:** Organize property and tenancy information.
- **Inspection Tracking:** Monitor property inspection progress and checklist items.
- **Maintenance Requests:** Track maintenance activities and their statuses.
- **Authentication:** Separate tenant and landlord access.

#  Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MySQL, MongoDB |
| API Communication | REST APIs |
| Styling | CSS |
| Version Control | Git, GitHub |

#  Project Structure

```text
RentSure/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

# ⚙️ Installation and Setup
# 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd RentSure
```

# 2. Backend Setup

```bash
cd backend
npm install
```

Configure your environment variables in a `.env` file using the required database credentials, JWT secret, and application configuration.

Start the backend using the start script configured in `backend/package.json`.

# 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.
# 4. Database Configuration

Configure the required MySQL and MongoDB database connections before running the application.

**Note:** Never upload database credentials, JWT secrets, or environment files to GitHub.

# Project Objective

RentSure aims to address common rental management challenges by providing better visibility, organized property information, and transparent tracking of rental activities and security deposits.

# Future Enhancements

- Cloud deployment and hosting.
- Digital rental agreement management.
- Enhanced property inspection records.
- Automated notifications and reminders.
- Advanced analytics and reporting.
- Improved deposit settlement workflows.

# Project Information

**Project:** RentSure – Smart Rental Transparency & Deposit Protection System

**Developed by:** Adith Lal

**GitHub:** https://github.com/adithlal23

---

*RentSure – Building trust and transparency in rental management.*