import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

const HeaderLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      className={`py-2 px-3 text-2xl font-bold rounded md:border-0 md:p-0 ${
        isActive 
          ? "text-blue-700 dark:text-blue-500" 
          : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
      }`}
      to={to}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const { logout } = useAuth({ middleware: "auth" });
  const [hideHeader, setHideHeader] = useState(false);

  return (
    <header
      className={`flex w-full justify-between bg-black p-5 ${
        hideHeader ? "hidden" : ""
      }`}
      style={{ position: "sticky", top: 0, zIndex: 999 }}
    >
      <h2 className="text-white font-extrabold text-3xl">EcoFarmacias</h2>
      <div className="flex flex-row gap-7">
        <HeaderLink to="/articulos/articulos-admin">Articulos</HeaderLink>
        <HeaderLink to="/ventas/ventas-caja">Ventas</HeaderLink>
        <button
          className="py-2 px-3 text-2xl font-bold text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          type="button"
          onClick={logout}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
