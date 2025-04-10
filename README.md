
# 📝 Leave Automation System for NIT Andhra Pradesh

A secure, full-stack web platform designed to automate the multi-level leave request and approval process for faculty and staff at NIT Andhra Pradesh. This system addresses inefficiencies in manual workflows with digital dashboards, OTP login, structured approvals, and real-time analytics.

Developed as part of an EPICS (Engineering Projects in Community Service) Project under the guidance of Dr. Karthick Seshadri, Assistant Professor.

---

## 🚩 Problem Statement

- ❌ Unclear multi-level leave approval flow causing frustration and bottlenecks
- 🐌 Slow, paper/email-based system leading to delays and confusion
- 🚫 No structured way to flag or prioritize urgent leave requests
- 🔍 Lack of visibility into trends, leading to mismanagement and poor decision-making

---

## ✅ Solution

- 🔐 OTP-based login system for secure access
- 🧾 Role-based dashboards for Faculty, Staff, and Admin
- 🔄 Dynamic multi-level approval flow with real-time status tracking
- 📊 Analytics dashboards for leave trend insights and bottleneck identification

---

## 🛠 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | React.js, TypeScript          |
| Backend       | Node.js, Express.js           |
| Database      | PostgreSQL (BCNF normalized)  |
| Authentication| Nodemailer (Email OTP)        |
| Hosting       | Render (planned)              |

---

## 🔄 Workflow Overview

1. User logs in via OTP
2. Leaves are submitted by Adhoc Faculty/Staff
3. Routed for approval to HoD → Dean FA → Registrar/Dy Director based on leave type and designation
4. Each stage updates approval status and triggers notifications
5. Leave balances and logs are updated in real-time

---

## 📊 Key Features

- Role-based access control and routing logic
- OTP-based email login using Nodemailer
- Clean UI built with React.js and TypeScript
- BCNF-structured database for performance and integrity
- Approval logs and visual analytics for transparency
- Admin-level dashboard to identify bottlenecks

---

## 🗂 Project Structure

```
/client     → React frontend (TypeScript)
/server     → Node.js + Express backend
/database   → SQL schema, ERD, and scripts
```

---

## 🧪 Upcoming Features

- [ ] Admin filters and reporting tools
- [ ] Leave balance history and status tracking
- [ ] Notification center and alert system
- [ ] Docker-based deployment

---

## 📌 Status

🛠 Currently under active development.  
🎓 EPICS Project | NIT Andhra Pradesh  
👨‍🏫 Mentor: Dr. Karthick Seshadri  
👨‍💻 Lead Developer: Adithya Sai Srinivas Mutta

---

## 🤝 Contributors

- Adithya Sai Srinivas Mutta – Developer, Designer, Project Lead  
- Bhuvan Nannam – Contributor

---

## 📬 Contact

📧 muttaadithyasaisrinivas@gmail.com  
🌐 [Portfolio](https://adithya369.onrender.com) • [LinkedIn](https://linkedin.com/in/adithyasaisrinivas)
