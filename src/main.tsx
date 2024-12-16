import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import App from './AppWithRedux'
import {Provider} from "react-redux";
import {store} from "./app/store.ts";
import { BrowserRouter, RouterProvider } from "react-router"
import { router } from "./common/routing/routing.v6.tsx"
// import App from "./AppWithReducers.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
    </StrictMode>,
)
