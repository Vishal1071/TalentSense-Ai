import { useAuth } from "../context/AuthContext.jsx";
import Circuler from "../components/commn/CircularProgress.jsx"

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-7">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {[
            { title: "Resumes Uploaded", value: 5 },
            { title: "Last Resume Score", value: 78 },
            { title: "JD Match", value: 65 },
            { title: "Mock Interviews", value: 2 },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-card p-4 rounded-lg"
            >
              <p className="text-muted">{card.title}</p>
              <p className="text-2xl font-bold text-accent"><Circuler percentage={card.value}/></p>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="mt-8 glass-card rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2 text-muted">
            <li>Resume uploaded — 2 hours ago</li>
            <li>Mock interview completed — yesterday</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
