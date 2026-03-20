# ⚡ AI-Powered Electricity Bill Analyzer (MERN + Gemini AI)

A modern web application that analyzes electricity bills, provides AI-generated insights, and helps users optimize their energy consumption.

---

## 🚀 Live Demo

👉 https://billwise-ai-bill-analyzer.netlify.app/

---

## 📌 Project Overview

This application allows users to upload or manually enter electricity bill data and receive a detailed AI-generated explanation using **Gemini API**. It also maintains a complete **bill history dashboard** with analytics and smart insights.

---

## ✨ Key Features

* 📄 Upload electricity bill (image/manual input)
* 🤖 AI-powered bill explanation (Gemini API)
* 📊 Smart dashboard with bill analytics
* 📅 Bill history tracking with filters & sorting
* ⚡ Energy consumption insights & optimization tips
* 🔍 Search, filter, and view past bills
* 🧠 Intelligent suggestions based on usage
* 🔐 Secure authentication system

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js (Vite)
* 🎯 Redux Toolkit (State Management)
* 🎨 Tailwind CSS
* 📊 Lucide Icons

### Backend

* 🟢 Node.js
* 🚀 Express.js
* 🍃 MongoDB (Mongoose)

### AI Integration

* 🤖 Google Gemini API (for bill explanation)

### Other Tools

* 🔐 JWT Authentication
* ☁️ Firebase (if used)
* 🌐 Vercel & Netlify (Deployment)

---

## 📂 Project Structure

```
client/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── redux/
 │    └── App.jsx
server/
 ├── controllers/
 ├── models/
 ├── routes/
 └── server.js
```

---

## 🧠 How It Works

1. User uploads or enters bill data
2. Backend processes and stores bill details
3. Gemini API generates a smart explanation
4. Data is saved in database (with history)
5. Dashboard displays analytics & insights

---

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Run project

```bash
# Start backend
npm run dev

# Start frontend
cd client
npm run dev
```

---

## 🌍 Environment Variables

Create a `.env` file in server:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

---

## 🎯 Future Improvements

* 📈 Advanced analytics with charts
* 📱 Mobile app (React Native)
* 🔔 Bill reminders & alerts
* 💡 Personalized energy-saving recommendations

---

## 👨‍💻 Author

**Abdul Majeed**
💼 MERN Stack Developer | React | Redux | Node.js | SEO

📧 abdulmajeed.professional@gmail.com
🔗 www.linkedin.com/in/abdul-majeed-baloch


---

## ⭐ Why This Project Stands Out

This project demonstrates:

* Real-world **MERN stack implementation**
* Integration of **AI (Gemini API)**
* Clean **state management using Redux**
* Scalable **backend architecture**
* Strong **UI/UX design with Tailwind**

---

## 🙌 Feedback

If you have any suggestions or feedback, feel free to connect or open an issue!

---

⭐ **If you like this project, don't forget to star the repo!**
