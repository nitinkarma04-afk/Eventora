# Eventora - Full-Stack Event Booking Platform

Eventora is a full-stack MERN event booking platform that allows users to discover events, view event details, submit booking requests, and manage their bookings.

The platform also provides an Admin Dashboard where administrators can create and manage events, review booking requests, confirm or reject bookings, and monitor event and booking statistics.



## 🚀 Features

### 👤 User Features

- User registration and login
- Email OTP verification during registration
- JWT-based authentication
- Browse available events
- Search events
- View detailed event information
- Book events using email OTP verification
- View booking status
- View personal booking history
- Cancel bookings
- View confirmed, pending, and cancelled bookings
- Responsive dark-themed UI

### 🔐 Admin Features

- Secure admin authentication
- Role-based access control
- Create new events
- Manage event information
- Delete events
- View all events
- View incoming booking requests
- Confirm or reject booking requests
- Mark bookings as Paid or Not Paid
- Monitor total events
- Monitor pending bookings
- Monitor confirmed clients
- Track total revenue

### 🎫 Booking System

- OTP verification before booking
- Prevents duplicate active bookings
- Checks available seats before confirmation
- Automatically updates available seats
- Restores seats when a confirmed booking is cancelled
- Maintains booking status:
  - Pending
  - Confirmed
  - Cancelled
- Maintains payment status:
  - Paid
  - Not Paid

### 📧 Email Notifications

Eventora uses Nodemailer for sending:

- Account verification OTP
- Booking verification OTP
- Booking confirmation emails

### 🎨 UI/UX

- Modern dark premium interface
- Responsive design
- Glassmorphism-style cards
- Event search
- Event cards with images
- Responsive navigation
- Separate User and Admin dashboards
- Built with React and Tailwind CSS



## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

### Database

- MongoDB Atlas

### Development Tools

- Git
- GitHub
- VS Code
- Postman



## 📂 Project Structure

```text
Eventora/
│
├── client/
│   ├── public/
│   │   └── events/
│   │       ├── ai-workshop.jpg
│   │       ├── ai-summit.jpg
│   │       └── music-festival.jpg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   └── PaymentFailed.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── axios.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── eventController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Booking.js
│   │   └── OTP.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── bookings.js
│   │
│   ├── utils/
│   │   └── email.js
│   │
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Eventora_Postman_Collection.json
├── .gitignore
├── package.json
└── README.md