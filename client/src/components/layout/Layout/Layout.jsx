import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import AnimatedBackground from '../../AnimatedBackground/AnimatedBackground'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
