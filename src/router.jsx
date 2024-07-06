import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Inicio from "./views/Inicio";
import AuthLayout from "./layout/AuthLayout";
import Login from "./views/Auth/Login";
import Registro from "./views/Auth/Registro";
import Articulos from "./views/Articulos/Articulos";
import Ventas from "./views/Ventas/Ventas";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
    ],
  },{
    path:'/auth',
    element:<AuthLayout/>,
    children:[{
      path:'/auth/login',
      element:<Login/>
    },{
      path:'/auth/registro',
      element:<Registro/>
    }]
  },
  {
    path:'/articulos',
    element:<Layout/>,
    children: [
      {
        path:'/articulos/articulos-admin',
        element:<Articulos/>
      }
    ]
  },
  {
    path:'/ventas',
    element:<Layout/>,
    children: [
      {
        path:'/ventas/ventas-caja',
        element:<Ventas/>
      }
    ]
  }
]);

export default router;
