import { useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import { AuthContext } from "./context/AuthContext";
import Loader from "./components/ui/Loader";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const EditProject = lazy(() => import("./pages/EditProject"));
const ViewProject = lazy(() => import("./pages/ViewProject"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Applications = lazy(() => import("./pages/Applications"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Messages = lazy(() => import("./pages/Messages"));
const Settings = lazy(() => import("./pages/Settings"));
const MyProjects = lazy(() => import("./pages/MyProjects"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Enforced Client Guard Wrap
const ClientRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Client") return <Navigate to="/dashboard" replace />;
  return children;
};

// Enforced Developer (Freelancer) Guard Wrap
const FreelancerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Freelancer") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]/50 dark:bg-[#0F172A]">
        <Loader size="lg" />
      </div>
    );
  }

  const suspenseFallback = (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]/50 dark:bg-[#0F172A] transition-colors duration-300">
      <Suspense fallback={suspenseFallback}>
        <Routes>
          {/* Guest only routes (with public Navbar) */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : (
                <>
                  <Navbar />
                  <Login />
                </>
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/dashboard" replace /> : (
                <>
                  <Navbar />
                  <Register />
                </>
              )
            }
          />
          <Route
            path="/verify-email"
            element={
              <>
                <Navbar />
                <VerifyOTP />
              </>
            }
          />

          {/* Dynamic routes based on Auth status */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "Client" ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <DashboardLayout>
                    <Home />
                  </DashboardLayout>
                )
              ) : (
                <>
                  <Navbar />
                  <Home />
                </>
              )
            }
          />
          <Route
            path="/view/:id"
            element={
              user ? (
                <DashboardLayout>
                  <ViewProject />
                </DashboardLayout>
              ) : (
                <>
                  <Navbar />
                  <ViewProject />
                </>
              )
            }
          />

          {/* Authenticated Shared Portal Routes */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              user ? (
                <DashboardLayout>
                  <ChangePassword />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/messages"
            element={
              user ? (
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Client Exclusive Pages */}
          <Route
            path="/my-projects"
            element={
              <ClientRoute>
                <DashboardLayout>
                  <MyProjects />
                </DashboardLayout>
              </ClientRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ClientRoute>
                <DashboardLayout>
                  <CreateProject />
                </DashboardLayout>
              </ClientRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ClientRoute>
                <DashboardLayout>
                  <EditProject />
                </DashboardLayout>
              </ClientRoute>
            }
          />

          {/* Developer (Freelancer) Exclusive Pages */}
          <Route
            path="/applications"
            element={
              <FreelancerRoute>
                <DashboardLayout>
                  <Applications />
                </DashboardLayout>
              </FreelancerRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <FreelancerRoute>
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              </FreelancerRoute>
            }
          />

          {/* Catch-all 404 Page */}
          <Route
            path="*"
            element={
              user ? (
                <DashboardLayout>
                  <NotFound />
                </DashboardLayout>
              ) : (
                <>
                  <Navbar />
                  <NotFound />
                </>
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;