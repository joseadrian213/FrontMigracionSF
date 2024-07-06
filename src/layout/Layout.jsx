import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
export default function Layout() {
  return (
    <>
      <Header/>
   
      <main className="bg-gray-100 text-gray-500 min-h-screen">
        <Outlet />
      </main>
     
     <footer>

     </footer>
    </>
  );
}
