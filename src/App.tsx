import AppRouter from "./router/AppRouter.js";
import { QueryClient, QueryClientProvider } from 'react-query';


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
