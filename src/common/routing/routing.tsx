import { createBrowserRouter, Navigate, Outlet, Route, RouteObject, Routes } from "react-router"
import { Main } from "../../app/main/Main.tsx"
import { Login } from "../../features/auth/ui/Login/Login.tsx"
import { Page404 } from "../../common/components/page404"
import { useAppSelector } from "./../../common/hooks/useAppSelector.ts"
import { selectLoggedIn } from "../../features/auth/model/authSelectors.ts"
import App from "../../AppWithRedux.tsx"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*"
} as const

const routes = [
  // { path: Path.Main, element: <Main />, isPrivate: true },
  // { path: Path.Login, element: <Login />, isPrivate: false },
  // { path: "/dashboard", element: <Dashboard />, isPrivate: true },
  // { path: "/profile", element: <Profile />, isPrivate: true },
  // { path: "/settings", element: <Settings />, isPrivate: true },
  // { path: Path.NotFound, element: <Page404 />, isPrivate: false }
]

export const PrivateRoutes = ({ children }) => {
  const isLoggedIn = useAppSelector(selectLoggedIn)

  return isLoggedIn ? children : <Navigate to={Path.Login} />
}

export const Routing = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.isPrivate ? (
              <PrivateRoutes>{route.element}</PrivateRoutes>
            ) : (
              route.element
            )
          }
        />
      ))}
    </Routes>
  )
}