import s from './Page404.module.css'
import Button from '@mui/material/Button';
import { Link } from "react-router"
import { Path } from "./../../../common/routing/routing.tsx"

export const Page404 = () => {
  return (
    <>
      <div className={s.container}>
        <h1 className={s.title}>404</h1>
        <h2 className={s.subTitle}>page not found</h2>
        <Button variant="contained" component={Link} to={Path.Main} >На Главную Страницу</Button>
      </div>
    </>
  )
}