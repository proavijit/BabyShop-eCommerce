
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className='h-screen flex overflow-hidden bg-background'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col ml-64 overflow-hidden'>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto overflow-x-hidden bg-muted/30 p-4 md:p-6 lg:p-8'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App