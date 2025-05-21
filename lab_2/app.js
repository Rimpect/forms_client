import express from 'express';
import cors from 'cors';
import authRoutes from './api/routes/authRoutes.js';
import profileRoutes from './api/routes/profileRoutes.js';
import statsRoutes from './api/routes/statsRoutes.js';
import themeRoutes from './api/routes/themeRoutes.js';
import usersRoutes from './api/routes/usersRoutes.js';
import { errorHandler, notFound } from './api/middlewares/errorMiddleware.js';

const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/users', usersRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});