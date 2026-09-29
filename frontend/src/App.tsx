import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ProtectedRouteLayout from "./layout/ProtectedRouteLayout";
import DashboardLayout from "./layout/DashBoardLayout";
import CandidateDashboard from "./pages/DashBoard/CandidateDashboard";
import ProfilePage from "./pages/Candidate/CandidateProfile";
import Application from "./pages/Candidate/Application";
import CompanyDashboard from "./pages/DashBoard/CompanyDashboard";
import RegisterPage from "./pages/Auth/RegisterPage";
import CompanyProfilePage from "./pages/Company/CompanyProfile";
import CreateJob from "./pages/Company/CreateJob";
import Jobs from "./pages/Candidate/Jobs";
import JobApplication from "./pages/Company/JobApplication";
import Reschedule from "./pages/Company/Reschedule";
import TodayInterview from "./pages/Company/TodayInterview";
import VideoRoomPage from "./pages/Company/VideoRoomPage";
import RoomLinkProtectedRoute from "./layout/RoomLinkProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRouteLayout allowedRoles={['candidate']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate-profile" element={<ProfilePage />} />
            <Route path="/candidate/applications" element={<Application />} />
            <Route path="/candidate/jobs" element={<Jobs />} />

          </Route>
        </Route>


        <Route element={<ProtectedRouteLayout allowedRoles={['candidate', 'company']} />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoomLinkProtectedRoute allowedRoles={['candidate', 'company']} />}>
              <Route path="/video/room/:roomId" element={<VideoRoomPage />} />
            </Route>

          </Route>
        </Route>



        <Route element={<ProtectedRouteLayout allowedRoles={['company']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/company-profile" element={<CompanyProfilePage />} />
            <Route path='/company/jobs' element={<CreateJob />} />
            <Route path="/job-applications/:jobId" element={<JobApplication />} />
            <Route path="/company/reschedule" element={<Reschedule />} />
            <Route path="/company/todayinterview" element={<TodayInterview />} />





          </Route>


        </Route>


      </Routes >

    </>
  );
}

export default App;
