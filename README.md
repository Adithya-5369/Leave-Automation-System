
# 📝 Faculty Leave Automation for NIT Andhra Pradesh

A secure, full-stack web platform designed to automate the multi-level leave request and approval process for faculty and staff at NIT Andhra Pradesh. This system addresses inefficiencies in manual workflows with digital dashboards, OTP login, structured approvals, and real-time analytics.

Developed as part of an EPICS (Engineering Projects in Community Service) Project under the guidance of [Dr. Karthick Seshadri, Assistant Professor, NIT Andhra Pradesh](https://nitandhra.ac.in/dept/cse/20075).

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

## 📽 Demo Video

[▶️ Watch it here](https://vimeo.com/1153397565).

---

## 📑 Documentation
- Presentation: [Click Here](https://drive.google.com/file/d/10oRGvYcej-fHLMAjYRk50VPmzgi8Z6uh/view?usp=sharing).
- Project Report: [Click Here](https://drive.google.com/file/d/1ZWAuu31UjMvT906xUGFbN7_BMRwG1ogv/view?usp=sharing).

---

## 🛠 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | React.js, TypeScript, JavaScript, Vite.js, Tailwind CSS |
| Backend       | Node.js, Express.js           |
| Database      | PostgreSQL (Normalized to BCNF)  |
| Authentication| Nodemailer (Email-based OTP verification)        |
| Deployment       | Frontend on Vercel, Backend on Render, PostgreSQL on Supabase              |

---

## 🔁 System Workflow

1. **Secure Login with OTP**  
   - Ensures authenticated access with email & OTP verification.

2. **User Dashboard**  
   - Displays leave balances, status of leave requests, and quick actions.

3. **Leave Request Submission**  
   - Input leave type, duration, and reason via a clean, responsive UI.

4. **Multi-Level Approval Flow**  
   - Requests are routed to:
     - Head of Department (HoD)
     - Dean FA
     - Registrar
     - Deputy Director

5. **Real-Time Notifications**  
   - Automated alerts for each approval stage.

6. **Live Status Tracking**  
   - Employees and admins can track current request status.

7. **Automated Leave Balance Update**  
   - Once approved, the system updates records in real time.

8. **Audit Logs**  
   - Maintains records for future reviews and reports.

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

## Author

**Adithya Sai Srinivas**  
📧 muttaadithyasaisrinivas@gmail.com  
🌐 [Portfolio](https://adithya369.pages.dev) • [LinkedIn](https://linkedin.com/in/adithyasaisrinivas)

---

## 🛡 License

This project is **not licensed for open-source use**.  
All rights reserved © 2025 Adithya Sai Srinivas.  
Please do **not copy, modify, reuse, or deploy** this project without explicit written permission.

📧 Contact for usage inquiries: muttaadithyasaisrinivas@gmail.com
