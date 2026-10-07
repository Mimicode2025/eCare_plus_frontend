import { RouterProvider } from 'react-router'
import { router } from '@/app/routes/router'
import { AuthProvider } from '@/features/auth'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
