# MeetX - Real-Time Video Conferencing Platform

MeetX is a real-time video conferencing web application that allows multiple participants to join online meetings, communicate through video and chat, share their screens, collaborate using a whiteboard, and customize their meeting experience.

## 🚀 Live Project

Live Demo: Add your Render URL here after deployment

GitHub Repository:
https://github.com/gnahitha/CodeAlpha_RealTimeApp

---

## ✨ Features

### 🎥 Video Conferencing
- Real-time video communication
- Multiple participants can join the same meeting
- Camera on/off control
- Microphone on/off control
- Participant management
- Participant count

### 💬 Real-Time Chat
- Send messages to meeting participants
- Receive messages instantly
- Chat notification badge
- Unread message count
- Messages from other participants are indicated through the notification badge

### 🖥️ Screen Sharing
- Share your screen with other participants
- Stop screen sharing when required

### 📝 Collaborative Whiteboard
- Draw and collaborate in real time
- Clear the whiteboard
- Multiple participants can use the whiteboard

### 🔗 Meeting Sharing
Participants can share meeting links using:

- Copy Meeting URL
- WhatsApp
- Email
- Native browser sharing

### ⚙️ Settings
MeetX provides meeting settings including:

- Light mode
- Dark mode
- Theme persistence
- Meeting interface customization

### ⏱️ Meeting Timer
- Displays the duration of the meeting
- Helps participants track meeting time

### 👥 Multiple Participants
- Multiple users can join the same meeting room
- Each participant gets a unique video connection
- Participant list updates when users join or leave

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS
- Font Awesome

### Backend
- Node.js
- Express.js
- Socket.IO

### Real-Time Communication
- PeerJS
- WebRTC
- Socket.IO

### Database
- MongoDB
- MongoDB Atlas

### Tools
- Git
- GitHub
- VS Code
- Render

---

## 📂 Project Structure

```text
CodeAlpha_RealTimeApp/
│
├── config/
│   └── database.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   └── User.js
│
├── routes/
│   ├── auth.js
│   └── room.js
│
├── sockets/
│   └── socket.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── room.ejs
│
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
