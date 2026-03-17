import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "./layout.css";

const Userlayout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Userlayout;