import { Route, Routes } from "react-router"
import { Main } from "../../app/main/Main.tsx"
import { Login } from "../../features/auth/ui/Login/Login.tsx"
import { Page404 } from "../../common/components/page404"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*"
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route path={Path.Main} element={<Main />} />
      <Route path={Path.Login} element={<Login />} />
      <Route path={Path.NotFound} element={<Page404 />} />
    </Routes>
  )
}