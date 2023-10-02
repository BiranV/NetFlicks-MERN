import { lazy, Suspense } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"
import { Provider } from "react-redux";
import store from './store/index';

const Auth = lazy(() => import('./components/Auth'));
const MovieDetails = lazy(() => import('./components/MovieDetails'));

function App() {
  const router = createBrowserRouter([
    {
      path: "/", element: <Layout />, children: [
        { path: "/", element: <Home /> },
        { path: "/auth", element: <Auth /> },
        { path: "/:id", element: <MovieDetails /> },
      ]
    }
  ])

  return (
    <Provider store={store}>
      <Suspense fallback={<h1 style={{ marginTop: "2rem" }}>Loading...</h1>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}

function Layout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}

export default App;
