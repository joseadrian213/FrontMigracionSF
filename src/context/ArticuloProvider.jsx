import { createContext, useState } from "react";
import clientAxios from "../config/axios";
import useSWR from "swr";

// Creación del contexto para manejar el estado global de los artículos
const ArticuloContext = createContext();

/**
 * Proveedor del contexto de artículos que maneja el estado y las operaciones relacionadas con los artículos.
 *
 * @param {Object} props - Propiedades pasadas al componente proveedor.
 * @param {ReactNode} props.children - Componentes hijos que serán envueltos por el proveedor.
 */
const ArticuloProvider = ({ children }) => {
  const token = localStorage.getItem("AUTH_TOKEN");

  // Estado para manejar los diferentes parámetros y configuraciones de la aplicación
  const [searchTerm, setSearchTerm] = useState("");
  const [busquedaIva, setBusquedaIva] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [resetSelect, setResetSelect] = useState(false);
  const [descuento, setDescuento] = useState(null);
  const [margenUtil, setMargenUtil] = useState(null);
  const [edicionDescMargen, setEdicionDescMargen] = useState(false);
  const [ivaCal, setIVaCal] = useState(null);
  const [iepsCal, setIepsCal] = useState(null);
  const [divSeleccionado, setDivSeleccionado] = useState(null);
  const [agregarForm, setAgregarForm] = useState(false);
  const [selectValorIva, setSelectValorIva] = useState("");
  const [selectValorIeps, setSelectValorIeps] = useState("");
  const [actuTab, setActuTab] = useState(1);
  const [centrarTabla, setCentrarTabla] = useState(false);
  const [searchTerminoFolio, setSearchTerminoFolio] = useState("");
  const [searchTerminoCaja, setSearchTerminoCaja] = useState("");
  const [caja, setCaja] = useState(7);
  const [folio, setFolio] = useState(1);

  /**
   * Función para obtener los artículos desde la API.
   *
   * @returns {Promise<Object>} - Datos de los artículos.
   */
  const fetcher = () =>
    clientAxios("/api/articulos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        searchTerm: searchTerm,
        page: paginaActual,
      },
    }).then((data) => data.data);

  // Hook SWR para obtener los artículos con un intervalo de actualización de 5000 ms
  const { data, error, isLoading } = useSWR(
    ["/api/articulos", token, searchTerm, paginaActual],
    fetcher,
    { refreshInterval: 5000 }
  );

  /**
   * Función para obtener los impuestos de los artículos desde la API.
   *
   * @returns {Promise<Object>} - Datos de los impuestos de los artículos.
   */
  const fetch = () =>
    clientAxios("/api/articuloImpuesto", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        busquedaIva,
      },
    }).then((data) => data.data);

  // Hook SWR para obtener los impuestos de los artículos con un intervalo de actualización de 5000 ms
  const {
    data: dataImpuesto,
    error: errorDataImpuesto,
    isLoading: isLoadingDataImpuesto,
  } = useSWR(["/api/articuloImpuesto", token, busquedaIva], fetch, {
    refreshInterval: 5000,
  });

  return (
    <ArticuloContext.Provider
      value={{
        isLoading,
        data,
        divSeleccionado,
        setDivSeleccionado,
        centrarTabla,
        setCentrarTabla,
        agregarForm,
        setAgregarForm,
        setSearchTerm,
        paginaActual,
        setPaginaActual,
        setBusquedaIva,
        dataImpuesto,
        isLoadingDataImpuesto,
        selectValorIva,
        setSelectValorIva,
        selectValorIeps,
        setSelectValorIeps,
        resetSelect,
        setResetSelect,
        busquedaIva,
        descuento,
        setDescuento,
        edicionDescMargen,
        setEdicionDescMargen,
        ivaCal,
        setIVaCal,
        iepsCal,
        setIepsCal,
        margenUtil,
        setMargenUtil,
        error,
        errorDataImpuesto,
        caja,
        setCaja,
        folio,
        setFolio,
        actuTab,
        setActuTab,
        searchTerminoFolio,
        setSearchTerminoFolio,
        searchTerminoCaja,
        setSearchTerminoCaja,
      }}
    >
      {children}
    </ArticuloContext.Provider>
  );
};

export { ArticuloProvider };
export default ArticuloContext;
