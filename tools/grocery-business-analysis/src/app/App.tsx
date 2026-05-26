import { RouterProvider } from 'react-router';
import { router } from './routes';
import { BusinessProvider } from './context/BusinessContext';

export default function App() {
  return (
    <BusinessProvider>
      <RouterProvider router={router} />
    </BusinessProvider>
  );
}