import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import clientAxios from "../config/axios";

/**
 * Hook personalizado para manejar la autenticación de usuarios.
 *
 * @param {Object} params - Parámetros de configuración para el middleware y URL de redirección.
 * @param {string} params.middleware - Middleware para manejar rutas protegidas.
 * @param {string} params.url - URL para redirigir al usuario autenticado.
 * @returns {Object} - Objeto con funciones y datos de autenticación del usuario.
 */
export const useAuth = ({ middleware, url }) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  const navigate = useNavigate();

  // Hook SWR para obtener los datos del usuario autenticado
  const { data: user, error, mutate } = useSWR("/api/user", () =>
    clientAxios("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw Error(error?.response?.data?.errors); // Si hay algún error, lo obtenemos
      })
  );

  /**
   * Efecto para manejar la validación de la sesión del usuario y redireccionar según el middleware.
   */
  useEffect(() => {
    if (middleware === "guest" && url && user) {
      navigate(url); // Redirigimos al usuario si es un invitado
    }
    if (middleware === "guest" && user && user.admin) {
      navigate("/admin"); // Redirigimos al usuario admin
    }
    if (middleware === "admin" && user && !user.admin) {
      navigate("/"); // Redirigimos al usuario no admin
    }
    if (middleware === "auth" && error) {
      navigate("/auth/login"); // Redirigimos al login si hay un error
    }
  }, [user, error]);

  /**
   * Función para manejar el inicio de sesión del usuario.
   *
   * @param {Object} datos - Datos de inicio de sesión del usuario.
   * @param {Function} setErrores - Función para establecer los errores de inicio de sesión.
   */
  const login = async (datos, setErrores) => {
    try {
      // Enviamos los datos de inicio de sesión
      const { data } = await clientAxios.post("/api/login", datos);
      localStorage.setItem("AUTH_TOKEN", data.token);
      setErrores([]);
      await mutate(); // Revalida la información del usuario
    } catch (error) {
      // Accedemos a los errores de Laravel y los mostramos
      if (error.response.data.errors) {
        setErrores(Object.values(error.response.data.errors));
      }
    }
  };

  /**
   * Función para manejar el registro de un nuevo usuario.
   *
   * @param {Object} datos - Datos de registro del usuario.
   * @param {Function} setErrores - Función para establecer los errores de registro.
   */
  const registro = async (datos, setErrores) => {
    try {
      // Enviamos los datos de registro
      const { data } = await clientAxios.post("/api/registro", datos);
      localStorage.setItem("AUTH_TOKEN", data.token);
      setErrores([]);
      await mutate(); // Revalida la información del usuario
    } catch (error) {
      // Accedemos a los errores de Laravel y los mostramos
      if (error.response.data.errors) {
        setErrores(Object.values(error.response.data.errors));
      }
    }
  };

  /**
   * Función para manejar el cierre de sesión del usuario.
   */
  const logout = async () => {
    try {
      // Enviamos la solicitud de cierre de sesión
      await clientAxios.post("/api/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("AUTH_TOKEN");
      await mutate(undefined); // Invalida la información del usuario
    } catch (error) {
      throw Error(error?.response?.data?.errors);
    }
  };

  return {
    login,
    registro,
    logout,
    user,
    error,
  };
};