import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { selectThemeMode } from "../../../../app/appSelectors"
import { useAppSelector } from "./../../../../common/hooks/useAppSelector.ts"
import { getTheme } from "./../../../../common/theme/theme.ts"
import Grid2 from "@mui/material/Grid2"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import s from "./Login.module.css"
import { useAppDispatch } from "./../../../../common/hooks/useAppDispatch.ts"
import { useNavigate } from "react-router"
import { useEffect } from "react"
import { Path } from "./../../../../common/routing/routing.tsx"
import { selectIsLoggedIn, setIsLoggedIn } from "../../../../app/appSlice.ts"
import { useLoginMutation } from "../../api/authApi.ts"
import { LoginArgs } from "../../api/authApi.types.ts"
import { ResultCode } from "./../../../../common/enums/enums.ts"

type Inputs = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const theme = getTheme(themeMode)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [login] = useLoginMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<LoginArgs>({ defaultValues: { email: "", password: "", rememberMe: false } })

  const onSubmit: SubmitHandler<LoginArgs> = data => {
    login(data)
      .then(res => {
        if (res.data?.resultCode === ResultCode.Success) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          localStorage.setItem('sn-token', res.data.data.token)
        }
      })
      .finally(() => {
        reset()
      })
  }

  useEffect(() => {
    if(isLoggedIn) {
      navigate(Path.Main)
    }
  }, [isLoggedIn, navigate])

  return (
    <Grid2 container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href={"https://social-network.samuraijs.com/"}
                target={"_blank"}
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Incorrect email address"
                }
              })} />
              {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
              <TextField type="password" label="Password" margin="normal" {...register("password", {
                required: 'Password is required',
                minLength: {
                  value: 3,
                  message: 'Password must be at least 3 characters long'
                }
              })} />
              <FormControlLabel label={"Remember me"} control={
                <Controller
                  control={control}
                  name={'rememberMe'}
                  render={({ field: { value, ...rest } }) => <Checkbox {...rest} checked={value} /> }
                />} />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid2>
  )
}