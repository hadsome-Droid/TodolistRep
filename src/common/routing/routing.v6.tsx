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

const privateRoutes: RouteObject[] = [
  {
    path: Path.Main,
    element: <Main />
  }
]

const publicRoutes: RouteObject[] = [
  {
    path: Path.Login,
    element: <Login />
  },
  {
    path: Path.NotFound,
    element: <Page404 />
  }
]

export const PrivateRoutes = () => {
  const isLoggedIn = useAppSelector(selectLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to={Path.Login} />
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PrivateRoutes />,
        children: privateRoutes
      },
      ...publicRoutes
    ]
  }
])