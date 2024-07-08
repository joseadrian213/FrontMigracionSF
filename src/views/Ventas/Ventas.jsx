import { useState, useEffect } from "react"; // Importa hooks de React
import ModalVentasTabla from "./ModalVentasTabla"; // Importa el componente ModalVentasTabla
import useArticulo from "../../hooks/useArticulo"; // Importa un hook personalizado para artículos
import useSWR from "swr"; // Importa el hook SWR para el manejo de datos
import clientAxios from "../../config/axios"; // Importa una instancia de Axios configurada
import { toast } from "react-toastify"; // Importa el módulo de notificaciones
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list"; // Importa componentes para listas deslizables
import "react-swipeable-list/dist/styles.css"; // Importa los estilos para las listas deslizables

export default function Ventas() {
  // Desestructuración del hook personalizado useArticulo para obtener caja, folio y términos de búsqueda
  const { caja, folio, searchTerminoFolio, searchTerminoCaja } = useArticulo();
  const token = localStorage.getItem("AUTH_TOKEN"); // Obtiene el token de autenticación desde el local storage
  const [selectedElement, setSelectedElement] = useState(null); // Estado para el elemento seleccionado
  const [sumaImporte, setSumaImporte] = useState(0); // Estado para la suma de importes
  const [sumaIva, setSumaIva] = useState(0); // Estado para la suma de IVA
  const [sumaIeps, setSumaIeps] = useState(0); // Estado para la suma de IEPS
  const [sumaDescuento, setSumaDescuento] = useState(0); // Estado para la suma de descuentos
  const [sumaTotal, setSumaTotal] = useState(0); // Estado para la suma total

  // Función para obtener los datos desde el servidor
  const fetch = () =>
    clientAxios("/api/articulos-detventa", {
      headers: {
        Authorization: `Bearer ${token}`, // Añade el token en los headers
      },
      params: {
        searchTerminoCaja: searchTerminoCaja, // Parámetro de búsqueda por caja
        searchTerminoFolio: searchTerminoFolio, // Parámetro de búsqueda por folio
      },
    }).then((data) => {
      return data.data;
    });

  // Uso del hook SWR para manejar la solicitud de datos
  const {
    data: dataDetVenta, // Datos obtenidos
    error: errorDetVenta, // Error en caso de que ocurra
    isLoading: isLoadigDetVenta, // Estado de carga
    mutate,
  } = useSWR(
    ["/api/articulos-detventa", token, searchTerminoCaja, searchTerminoFolio],
    fetch
  );

  // Función para eliminar un registro
  const deleteRecord = (vta_amecop, vta_caja, vta_tran) => {
    return clientAxios
      .delete("/api/articulos-detventa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          vta_amecop: vta_amecop, // Código del artículo
          vta_caja: vta_caja, // Número de caja
          vta_tran: vta_tran, // Número de transacción
        },
      })
      .then((response) => {
        return response.data;
      });
  };

  // Maneja la selección de un elemento para eliminar
  const handleClickDelete = (element) => {
    setSelectedElement(element); // Establece el elemento seleccionado
    toast.success(`Elemento seleccionado: ${element.vta_amecop}`); // Muestra una notificación de éxito
  };

  // Maneja la eliminación de un elemento
  const handleDelete = (element) => {
    deleteRecord(element.vta_amecop, element.vta_caja, element.vta_tran)
      .then((data) => {
        toast.success("Registro eliminado"); // Muestra una notificación de éxito
        mutate(data); // Refresca los datos después de la eliminación
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        toast.error("Error al eliminar el registro"); // Muestra una notificación de error
      });
  };

  // Efecto para manejar la tecla de eliminar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedElement) {
        handleDelete(selectedElement); // Llama a la función handleDelete si se presiona la tecla "Delete"
      }
    };

    document.addEventListener("keydown", handleKeyDown); // Añade el listener de la tecla "Delete"
    return () => {
      document.removeEventListener("keydown", handleKeyDown); // Limpia el listener al desmontar el componente
    };
  }, [selectedElement]);

  // Función para eliminar artículos
  const btnDelete = () => {
    const element = {
      vta_amecop: null, // Asigna null por defecto
      vta_caja: caja, // Usa el valor de caja
      vta_tran: folio, // Usa el valor de folio
    };
    setSelectedElement(element); // Establece el elemento seleccionado
    handleDelete(element); // Llama a la función handleDelete
  };

  // Configuración de acciones de deslizamiento
  const trailingActions = (element) => (
    <TrailingActions>
      <SwipeAction onClick={() => handleDelete(element)} destructive={true}>
        Eliminar
      </SwipeAction>
    </TrailingActions>
  );

  // Efecto para calcular los totales
  useEffect(() => {
    const initialTotals = {
      total: 0,
      importe: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
    };

    const totals = dataDetVenta?.detventa?.reduce((acumulador, elementoActual) => {
      return {
        total: acumulador.total + elementoActual.vta_total,
        importe: acumulador.importe + elementoActual.vta_importe,
        iva: acumulador.iva + elementoActual.vta_iva,
        ieps: acumulador.ieps + elementoActual.vta_ieps,
        descuento: acumulador.descuento + elementoActual.vta_descuento,
      };
    }, initialTotals);

    if (totals) {
      setSumaTotal(totals.total); // Establece la suma total
      setSumaImporte(totals.importe); // Establece la suma de importes
      setSumaIva(totals.iva); // Establece la suma de IVA
      setSumaIeps(totals.ieps); // Establece la suma de IEPS
      setSumaDescuento(totals.descuento); // Establece la suma de descuentos
    }
  }, [dataDetVenta?.detventa]);

  return (
    <div className="mx-auto">
      <div className="mb-1 group w-full grid grid-cols-2  gap-1 items-center justify-center rounded-md border-2  border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
        <p className="text-slate-800" id="radio_busqueda">
          Caja: <span>{caja}</span>
        </p>
        <p className="text-slate-800" id="radio_busqueda">
          Folio: <span>{folio}</span>
        </p>
        <div>
          <label
            htmlFor="a_costo"
            className="text-slate-800 uppercase text-sm font-bold"
          >
            Empleado
          </label>
          <input
            className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
            id="a_costo"
            name="a_costo"
            // value={a_costo || ""}
            // onChange={valorInput}
            // ref={a_costoRef}
          />
        </div>
        <div>
          <label
            htmlFor="a_costo"
            className="text-slate-800 uppercase text-sm font-bold"
          >
            CEL
          </label>
          <input
            className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
            id="a_costo"
            name="a_costo"
            // value={a_costo || ""}
            // onChange={valorInput}
            // ref={a_costoRef}
          />
        </div>
        <div>
          <label
            htmlFor="a_costo"
            className="text-slate-800 uppercase text-sm font-bold"
          >
            Cliente
          </label>
          <input
            className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
            id="a_costo"
            name="a_costo"
            // value={a_costo || ""}
            // onChange={valorInput}
            // ref={a_costoRef}
          />
          <div className="flex justify-center mt-3 ">
            <input
              defaultValue="Agregar"
              className="cursor-pointer text-sm text-center p-3 bg-blue-950 hover:bg-blue-800 text-white font-bold py-1 px-1 mb-1 rounded-full"
            />
          </div>
        </div>
        <input
          defaultValue="Existencia DIFARMASA"
          className="cursor-pointer text-sm text-center  bg-blue-950 hover:bg-blue-800 text-white font-bold py-3 px-3 mb-1 rounded-full"
        />
      </div>
      <ModalVentasTabla />
      {/* Tabla buscador */}
      <div className="w-full flex justify-center mt-2 mx-auto overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="shadow border border-gray-200 rounded-lg">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700 ">
            <tr>
              <th className="px-6 py-3 text-left">Amecop</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Piezas</th>
              <th className="px-6 py-3 text-left">Precio</th>
              <th className="px-6 py-3 text-left">Importe</th>
              <th className="px-6 py-3 text-left">Iva</th>
              <th className="px-6 py-3 text-left">Ieps</th>
              <th className="px-6 py-3 text-left">Descuento</th>
              <th className="px-6 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* <SwipeableList> */}

            {dataDetVenta?.detventa?.map((element, i) => (
              // <SwipeableListItem trailingActions={trailingActions()}>
              <tr
                className="bg-white border-b h-4 hover:bg-gray-200 "
                key={element.vta_amecop}
                onClick={() => handleClickDelete(element)}
              >
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-amecop-${element.vta_amecop}`}
                >
                  {element.vta_amecop}
                </td>

                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-nombre-${element.vta_amecop}`}
                >
                  {element.a_nombre}
                </td>

                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-piezas-${element.vta_amecop}`}
                >
                  {element.vta_piezas}
                </td>

                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-precio-${element.vta_amecop}`}
                >
                  {element.vta_precio}
                </td>
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-importe-${element.vta_amecop}`}
                >
                  {element.vta_importe}
                </td>
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-iva-${element.vta_amecop}`}
                >
                  {element.vta_iva}
                </td>
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-ieps-${element.vta_amecop}`}
                >
                  {element.vta_ieps}
                </td>
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-descuento-${element.vta_amecop}`}
                >
                  {/* {element.vta_descuento || "0"} */}
                  {(element.vta_descuento)?.toFixed(2)}
                </td>
                <td
                  className="h-4 px-6 py-4 text-left"
                  key={`td-total-${element.vta_amecop}`}
                >
                  {element.vta_total?.toFixed(2)}
                </td>
              </tr>
              // </SwipeableListItem>
            ))}
            {/* </SwipeableList> */}
          </tbody>
        </table>
      </div>
      {dataDetVenta?.detventa?.length > 0 && (
        <div className=" flex flex-col items-center  ">
          <div className="shadow border border-gray-200 rounded-lg">
            <p className="block font-semibold p-1 text-gray-400 uppercase bg-gray-700">
              Resumen Operacion
            </p>
            <div className="bg-white border-b">
              <p className="block font-medium">Piezas {sumaImporte}</p>
              <p className="block">Importe {sumaImporte} </p>
              <p className="block">Iva {sumaIva}</p>
              <p className="block">Ieps {sumaIeps}</p>
              <p className="block">Descuento {sumaDescuento?.toFixed(2)}</p>
              <p className="block">Total {sumaTotal?.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-center mt-3 gap-2">
            <input
              defaultValue="Eliminar articulos"
              onClick={() => btnDelete()}
              className="cursor-pointer text-sm text-center p-3 bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-1 mb-1 rounded-full"
            />
            <input
              defaultValue="Guardar Edición"
              className="cursor-pointer text-sm text-center p-3 bg-blue-950 hover:bg-blue-800 text-white font-bold py-1 px-1 mb-1 rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
