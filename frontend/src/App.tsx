import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute roles={["recruiter"]} />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
