import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import '../.././main.css'

const Userlayout = () => {
  return (
    <>
      <div className='user-layout'>
        <Sidebar />
        <div className="user-main">
            <Outlet />
        </div>
      </div>
    </>
  )
}

export default Userlayout
