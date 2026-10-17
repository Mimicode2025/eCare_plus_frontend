import { RouterProvider } from 'react-router'
import { router } from '@/app/routes/router'
import { FeedbackProvider } from '@/components/ui/FeedbackProvider'
import { AuthProvider } from '@/features/auth'

function App() {
  return (
    <FeedbackProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </FeedbackProvider>
  )
}

export default App
