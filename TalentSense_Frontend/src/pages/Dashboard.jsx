import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
    const { user, logout } = useAuth();

  return (
    <>
    <div>
        <h1>Dashboard</h1>
        <p>welcome, {user?.email}</p>
        <button onClick={logout}>Logout</button>
    </div>
    </>
  )
}

export default Dashboard;
