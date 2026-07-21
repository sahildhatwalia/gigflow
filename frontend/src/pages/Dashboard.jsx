import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiFileText,
  FiUser,
  FiDollarSign,
  FiPlus,
  FiArrowRight,
  FiCheckCircle,
  FiActivity,
  FiStar,
  FiFolder,
  FiMessageSquare,
  FiSettings,
  FiEye,
} from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import projectsApi from "../api/projects";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Loader from "../components/ui/Loader";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Dashboard states
  const [userProjects, setUserProjects] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [stats, setStats] = useState({
    projectsCount: 0,
    applicationsCount: 0,
    totalBudget: 0,
  });

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all projects to calculate stats
      const resProj = await projectsApi.getProjects(1, 100);
      const allProjects = resProj.data.projects || [];
      
      if (user.role === "Client") {
        // Filter projects posted by this client
        const myPostings = allProjects.filter(
          (p) => p.client === user.id || p.client?._id === user.id
        );
        setUserProjects(myPostings);

        const totalBudget = myPostings.reduce((acc, curr) => acc + (curr.budget || 0), 0);
        const bidsReceivedCount = myPostings.reduce((acc, curr) => acc + (curr.proposals?.length || 0), 0);

        setStats({
          projectsCount: myPostings.length,
          applicationsCount: bidsReceivedCount,
          totalBudget,
        });
      } else {
        // Developer (Freelancer) - Fetch applied proposals from endpoint
        const resApps = await projectsApi.getMyProposals();
        const myApps = resApps.data || [];
        setUserApplications(myApps);

        const activeBidsCount = myApps.length;
        const potentialEarnings = myApps
          .filter(app => app.status === "accepted" || app.status === "pending")
          .reduce((acc, curr) => acc + (curr.bidAmount || 0), 0);

        setStats({
          projectsCount: 0,
          applicationsCount: activeBidsCount,
          totalBudget: potentialEarnings,
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Profile completion calculation
  const fields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.bio,
    user?.address,
    user?.github,
    user?.linkedin,
    user?.website,
    user?.avatar,
  ];
  const completed = fields.filter((item) => item && item.trim() !== "").length;
  const percentage = Math.round((completed / fields.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  const statusVariant = {
    open: "success",
    "in-progress": "warning",
    completed: "default",
    cancelled: "danger",
    pending: "warning",
    accepted: "success",
    rejected: "danger",
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,127,237,0.12),transparent)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={user.name} size="lg" className="border-2 border-slate-700" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                You are logged in as a <strong>{user.role}</strong>. Manage your operations from your personalized desk.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user.role === "Client" ? (
              <Button
                onClick={() => navigate("/create")}
                className="flex items-center gap-2"
              >
                <FiPlus />
                Post Project
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                Browse Projects
              </Button>
            )}
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="text-white border-slate-700 hover:bg-slate-800"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.role === "Client" ? (
          <>
            <StatCard
              title="Active Projects Posted"
              value={stats.projectsCount}
              icon={FiBriefcase}
              trend="Managed contracts"
              description="Total active listings"
            />
            <StatCard
              title="Total Outlay Budget"
              value={`₹${stats.totalBudget.toLocaleString("en-IN")}`}
              icon={FiDollarSign}
              trend="Total job budgets"
              description="Estimated outsourcing costs"
            />
            <StatCard
              title="Bids Received"
              value={stats.applicationsCount}
              icon={FiFileText}
              trend="Active developer proposals"
              description="Proposals submitted by candidates"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Applications Submitted"
              value={stats.applicationsCount}
              icon={FiFileText}
              trend="Active project proposals"
              description="Total bids in pipeline"
            />
            <StatCard
              title="Potential Earnings"
              value={`₹${stats.totalBudget.toLocaleString("en-IN")}`}
              icon={FiDollarSign}
              trend="Accepted & pending bids"
              description="Revenue outlook"
            />
            <StatCard
              title="Profile Integrity"
              value={`${percentage}%`}
              icon={FiUser}
              trend={percentage === 100 ? "Excellent" : "Action recommended"}
              description="Completeness metric"
            />
          </>
        )}
      </div>

      {/* Grid Layout for details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center: Dynamic tables and actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Role specific display cards */}
          {user.role === "Client" ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiBriefcase className="text-brand-500" />
                  <span>My Active Project Postings</span>
                </h3>
                <Link to="/my-projects" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
                  <span>Manage Gigs</span>
                  <FiArrowRight />
                </Link>
              </div>

              {userProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  You haven't posted any projects yet. 
                  <Link to="/create" className="text-brand-500 hover:underline ml-1 font-semibold">Post a Project</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-3">Title</th>
                        <th className="py-3">Budget</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Bids</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {userProjects.slice(0, 5).map((project) => (
                        <tr key={project._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                            <Link to="/my-projects" className="hover:underline line-clamp-1">
                              {project.title}
                            </Link>
                          </td>
                          <td className="py-3.5 text-slate-600 dark:text-slate-400 font-semibold">
                            ₹{project.budget.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5">
                            <Badge variant={statusVariant[project.status] || "default"}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 text-right font-bold text-slate-800 dark:text-slate-200">
                            {project.proposals?.length || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiFileText className="text-brand-500" />
                  <span>My Submitted Applications</span>
                </h3>
                <Link to="/applications" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
                  <span>Manage Applications</span>
                  <FiArrowRight />
                </Link>
              </div>

              {userApplications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  You haven't submitted any proposals yet.
                  <Link to="/" className="text-brand-500 hover:underline ml-1 font-semibold">Browse Projects</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700/60 pb-3 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <th className="py-3">Job Title</th>
                        <th className="py-3">My Proposal Bid</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Applied Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {userApplications.slice(0, 5).map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">
                            <Link to={`/view/${app.project._id}`} className="hover:underline line-clamp-1">
                              {app.project.title}
                            </Link>
                          </td>
                          <td className="py-3.5 text-slate-600 dark:text-slate-400 font-semibold">
                            ₹{app.bidAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5">
                            <Badge variant={statusVariant[app.status] || "default"}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 text-right text-xs text-slate-500 dark:text-slate-400">
                            {new Date(app.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FiActivity className="text-brand-500" />
              <span>Activity Log</span>
            </h3>

            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  {
                    title: `${user.role} Session Active`,
                    desc: `Workspace initialized under developer portal.`,
                    time: "Just now",
                    icon: FiCheckCircle,
                    color: "text-brand-500",
                  },
                  {
                    title: "OTP Verification",
                    desc: "Account verification checks resolved successfully.",
                    time: "1 hour ago",
                    icon: FiStar,
                    color: "text-brand-500",
                  },
                ].map((act, actIdx) => (
                  <li key={actIdx}>
                    <div className="relative pb-8">
                      {actIdx !== 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <act.icon size={14} className={act.color} />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {act.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {act.desc}
                            </p>
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-slate-400">
                            <time>{act.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

        </div>

        {/* Right Sidebar: Profile Completion & Quick Actions */}
        <div className="space-y-8">
          
          {/* Profile completeness card */}
          <Card>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Profile completeness
            </h3>

            <div className="flex justify-between items-center mb-2 text-xs font-bold">
              <span className="text-slate-500">Workspace health</span>
              <span className="text-brand-500">{percentage}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-6">
              <div
                style={{ width: `${percentage}%` }}
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Tips to complete:</span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                {percentage < 100 ? (
                  <>
                    {!user.avatar && <li>• Upload an avatar photo</li>}
                    {!user.bio && <li>• Detail your biography inside settings</li>}
                    {!user.phone && <li>• Enter a mobile phone number</li>}
                    {!user.github && <li>• Hook your GitHub repository details</li>}
                  </>
                ) : (
                  <li className="text-brand-500 font-bold flex items-center gap-1.5">
                    <FiCheckCircle />
                    <span>Workspace fully verified!</span>
                  </li>
                )}
              </ul>
            </div>

            <Link
              to="/settings"
              className="text-xs text-brand-500 hover:text-brand-600 font-bold flex items-center gap-1 group w-fit"
            >
              <span>Settings configuration</span>
              <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          {/* Quick Actions Panel */}
          <Card>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {user.role === "Client" ? (
                <>
                  <Link to="/create">
                    <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                      <FiPlus className="text-brand-500" />
                      <span>Post a new Project</span>
                    </button>
                  </Link>
                  <Link to="/my-projects">
                    <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                      <FiBriefcase className="text-brand-500" />
                      <span>Manage Project Postings</span>
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/">
                    <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                      <FiBriefcase className="text-brand-500" />
                      <span>Browse Gigs Feed</span>
                    </button>
                  </Link>
                  <Link to="/portfolio">
                    <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                      <FiFolder className="text-brand-500" />
                      <span>Manage Developer Portfolio</span>
                    </button>
                  </Link>
                </>
              )}

              <Link to="/messages">
                <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                  <FiMessageSquare className="text-brand-500" />
                  <span>Send a Message</span>
                </button>
              </Link>

              <Link to="/settings">
                <button className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition text-left cursor-pointer">
                  <FiSettings className="text-brand-500" />
                  <span>Configure Settings</span>
                </button>
              </Link>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
