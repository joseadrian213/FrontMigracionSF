import { createRef, useState } from "react";
import Alerta from "../../components/Alerta";
import { useAuth } from "../../hooks/useAuth";

export default function Registro() {
  const nameRef=createRef(); 
  const emailRef=createRef();
  const nombre_y_apellidosRef=createRef(); 
  const idEmpleadoRef=createRef(); 
  const rolEmpleadoRef=createRef(); 
  const passwordRef=createRef(); 
  const passwordConfirmationRef=createRef(); 
  
  const [errores,setErrores]=useState([]); 

  const {registro}=useAuth({middleware:'guest',url:'/'})
  const handleSubmit=async e=>{
    e.preventDefault(); 
    
    const datos={
      name:nameRef.current.value,
      email:emailRef.current.value,
      nombre_y_apellidos:nombre_y_apellidosRef.current.value,
      id_empleado:Number(idEmpleadoRef.current.value),
      rol:Number(rolEmpleadoRef.current.value),
      password:passwordRef.current.value,
      password_confirmation:passwordConfirmationRef.current.value
    }
    registro(datos,setErrores)
    
  }

  return (
    <>
     <h1 className='text-4xl font-black'>Registro</h1>
     <div className='bg-white shadow-md rounded-md mt-10 px-5 py-10'>
      <form onSubmit={handleSubmit} noValidate>
        <div className='mb-4'>
          <label 
          className='text-slate-800' 
          htmlFor="name">
            Username
          </label>
          <input
          type="text"
          id='name' 
          className='mt-2 w-full block p-3 bg-gray-50' 
          placeholder='Username'
          ref={nameRef}
          />
        </div>
        
        <div className='mb-4'>
          <label 
          className='text-slate-800' 
          htmlFor="email">
            Email
          </label>
          <input
          type="email"
          id='email' 
          className='mt-2 w-full block p-3 bg-gray-50' 
          placeholder='Email'
          ref={emailRef}
          />
        </div>
        
        <div className='mb-4'>
          <label 
          className='text-slate-800' 
          htmlFor="nombre_y_apellidos">
            Nombre y Apellidos
          </label>
          <input
          type="text"
          id='nombre_y_apellidos' 
          className='mt-2 w-full block p-3 bg-gray-50' 
          placeholder='Nombre y Apellidos'
          ref={nombre_y_apellidosRef}
          />
        </div>

        <div className='mb-4'>
          <label 
          className='text-slate-800' 
          htmlFor="id_empleado">
            Id Empleado
          </label>
          <input
          type="text"
          id='id_empleado' 
          className='mt-2 w-full block p-3 bg-gray-50' 
          placeholder='Id Empleado'
          ref={idEmpleadoRef}
          />
        </div>

        <div className='mb-4'>
          <label 
          className='text-slate-800' 
          htmlFor="rol">
            Rol Empleado
          </label>
          <select 
          id='rol' 
          className='mt-2 w-full block p-3 bg-gray-50'
          ref={rolEmpleadoRef}
          >
            <option  className=' text-center' >--Selecciona un Rol--</option>
            <option value="1">Administrador</option>
            <option value="2">Supervisor</option>
            <option value="3">Ventas</option>
          </select>
        </div>
     
        <div className="mb-4">
            <label className="text-slate-800" htmlFor="password">
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

        <div className="mb-4">
            <label className="text-slate-800" htmlFor="password_confirmation">
              Repetir Password:
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className="mt-2 w-full block p-3 bg-gray-50"
              placeholder="Repetir Password"
              ref={passwordConfirmationRef}
            />
          </div>

        <input
            type="submit"
            value="Crear Cuenta"
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
          />


      </form>
      </div> 
    </>
  )
}
