import dotenv from 'dotenv';
dotenv.config({ silent: true });
import express from 'express';
const app = express();
import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import authRouter from './Routes/AuthRouter.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectDB from './models/db.js';
connectDB();
import  passport from './Controllers/auth.js';
import apartmentRoutes from './Routes/apartmentRoutes.js';
import adminAuthRoutes from './Routes/admineAuthRoutes.js';
import uploadRoutes from './Routes/uploadRoutes.js';
import bookingRoutes from './Routes/bookingRoutes.js';
const initialize = () => passport.initialize();
const sessionMiddleware = () => passport.session();
const PORT = process.env.PORT || 5000;



//✅ Middleware
app.use(cookieParser());      
app.use(express.json());
const allowedOrigins = ['http://localhost:8080'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,     
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // allow cookies / sessions
  })
);
// app.use(cors({
//   origin: "http://localhost:8080",
//   credentials: true,   // allow cookies
// }));


// 🔑 Enable session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite:process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000 } // 5 min expiry
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(initialize());
app.use(sessionMiddleware());
app.use('/auth', authRouter);
app.use("/api/auth", adminAuthRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api', uploadRoutes);
app.use('/api/bookings', bookingRoutes);

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({ 
    message: 'Apartment Booking API Server',
    endpoints: {
      auth: '/auth/*',
      upload: '/api/upload',
      apartments: '/api/apartments/*',
      bookings: '/api/bookings/*',      // NEW endpoint
    }
  });
});



app.get('/home', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!`, user: req.user });
});



//  Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
