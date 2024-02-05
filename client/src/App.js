import { lazy, Suspense } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"

const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));

function App() {
  const router = createBrowserRouter([
    {
      path: "/", element: <Layout />, children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/:id", element: <MovieDetails /> },
      ]
    }
  ])

  return (
    <Suspense fallback={<h1 style={{ marginTop: "2rem" }}>Loading...</h1>}>
      <RouterProvider router={router} />
    </Suspense>
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
