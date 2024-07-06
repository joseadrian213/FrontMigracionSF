import { Link } from 'react-router-dom'
import Alerta from '../../components/Alerta'
import { createRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
export default function Login() {
  const idEmpleadoRef=createRef();
  const passwordRef=createRef(); 
  
  const [errores,setErrores]=useState([]); 
  
  const {login}=useAuth({
    middleware:'guest',
    url:'/'
  })

  const handleSubmit=async (e)=>{
    
    e.preventDefault()
    
    const datos={
      id_empleado:Number(idEmpleadoRef.current.value),
      password: passwordRef.current.value 
    }
  
    login(datos,setErrores)
  }
  return (
    <>
    <h1 className="text-4xl font-black">Iniciar Sesión</h1>
    <p>Para crear un pedido debes de iniciar sesión </p>
    <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
      <form 
            onSubmit={handleSubmit}
            noValidate
      >
       {/* {errores
          ? errores.map((error, i) => <Alerta key={i}>{error}</Alerta>)
          : null} */}
          <div className="mb-4">
              <label
               className="text-slate-800" 
               htmlFor="username">
              Id Empleado:
              </label>
              <input
               type="text"
               id="username"
               name="username"
               className="mt-2 w-full block p-3 bg-gray-50"
               placeholder="Tu username"
               ref={idEmpleadoRef}
               />
          </div>
          <div className="mb-4">
              <label
               className="text-slate-800" 
               htmlFor="password">
              Password:
              </label>
              <input
               type="password"
               id="password"
               name="password"
               className="mt-2 w-full block p-3 bg-gray-50"
               placeholder="Tu Password"
               ref={passwordRef}
               />
          </div>
      
          <input
           type="submit"
           value="Iniciar Sesión"
           className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
           />
      </form>
    </div>
  </>
  )
}
