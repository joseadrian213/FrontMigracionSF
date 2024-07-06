import React from 'react'

export default function Alerta({children}) {//Con el children podemos obtener cualquier tipo de dato en este caso ppor eso la alerta se hace dinamica 
    return (
      <div className="text-center my-2 bg-red-600 text-white font-bold p-3 uppercase">
        {children}
      </div>
    )
  }
