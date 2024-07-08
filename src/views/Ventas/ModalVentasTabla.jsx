import { useState, useEffect, createRef } from "react";
import Modal from "react-modal";
import clientAxios from "../../config/axios";
import "../../css/spinner.css";
import "../../css/spinnerBusqueda.css";
import useSWR, { mutate } from "swr";
import Pagination from "rc-pagination/lib/Pagination";
import "rc-pagination/assets/index.css";
import useArticulo from "../../hooks/useArticulo";
import { toast } from "react-toastify";

// Estilos personalizados para el modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalVentasTabla = () => {
  const {
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
  } = useArticulo();
  
  // Obtención del token desde el localStorage
  const token = localStorage.getItem("AUTH_TOKEN");
  
  // Definición de estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermino, setSearchTermino] = useState("");
  const [tablaSelectClick, setTablaSelectClick] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedRow, setSelectedRow] = useState("");

  // Creación de referencias para elementos del DOM
  const amecopRef = createRef();
  const piezasRef = createRef();
  const descRef = createRef();

  // Función para calcular el precio con descuentos e impuestos
  const getPrice = (precioPublico, descto, ivaCal, iepsCal) => {
    let price;
    let descuento = Number(((precioPublico * descto * -1.0)/100).toFixed(2));
    let iva = Number(((precioPublico + descuento) * ivaCal).toFixed(2));
    let ieps = Number(((precioPublico + descuento) * iepsCal).toFixed(2));
    price = precioPublico + iva + ieps + descuento;
 
    return {
      price,
      descuento,
      iva,
      ieps
    }
  };

  // Efecto para establecer el elemento raíz del modal
  useEffect(() => {
    Modal.setAppElement("#ventas");
  }, []);

  // Función para abrir el modal
  function openModal() {
    setIsOpen(true);
  }

  // Función para cerrar el modal
  function closeModal() {
    setIsOpen(false);
  }

  // Función para enviar información
  const enviarInfo = () => {
    setSearchTerm(amecopRef.current.value);

  };


  // Función para enviar datos a una URL específica
  const enviarDatos = async (url, datos) => {
    // const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clientAxios.post(url, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  };

  // Función para obtener datos con SWR
  const fetcher = () =>
    clientAxios("/api/articulos-existencia/existencia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        searchTerm: searchTerm,
        page: paginaActual,
      },
    }).then((data) => data.data);
  
  const {
    data,
    error,
    isLoading,
    mutate: mutatePrincipal,
  } = useSWR(["/api/articulos", token, searchTerm, paginaActual], fetcher);

  // Otra función para obtener datos con SWR
  const fetch = () =>
    clientAxios("/api/articulos-detventa", {
      headers: {
        Authorization: `Bearer {token}`,
      },
      params: {
        searchTerminoCaja: searchTerminoCaja,
        searchTerminoFolio: searchTerminoFolio,
      },
    }).then((data) => data.data);

  const {
    data: dataDetVenta,
    error: errorDetVenta,
    isLoading: isLoadigDetVenta,
    mutate,
  } = useSWR(
    ["/api/articulos-detventa", token, searchTerminoCaja, searchTerminoFolio],
    fetch
  );

  // Efecto para buscar un artículo cuando se actualizan ciertos valores
  useEffect(() => {
    if (
      amecopRef.current &&
      amecopRef.current.value.length === 15 &&
      !isNaN(Number(amecopRef.current.value)) &&
      Number(amecopRef.current.value) > 0
    ) {
      console.log("foud dentro 1");
      // console.log(data?.articulos);
      const foundArticulo = data?.articulos.find(
        (articulo) => articulo.a_amecop === amecopRef.current.value );
      if (foundArticulo) {
        console.log("foud dentro 2 ");
        setSelectedRow(foundArticulo);
        setSearchTerminoCaja(caja);
        setSearchTerminoFolio(folio);
        mutatePrincipal();
      }
    }
  }, [data, amecopRef.current?.value, caja, folio, mutatePrincipal]);

  // Función para manejar la tecla Enter en distintos campos
  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      switch (e.target.id) {
        case "busqueda_amecop":
          if (
            amecopRef.current &&
            amecopRef.current.value.length === 15 &&
            !isNaN(Number(amecopRef.current.value)) &&
            Number(amecopRef.current.value) > 0
          ) {
            enviarInfo();
            setPaginaActual(1)
            document.getElementById("piezas").focus();
          } else {
            enviarInfo();
            document.getElementById("piezas").focus();
            setSearchTerminoCaja(caja);
            setSearchTerminoFolio(folio);
            setIsOpen(true);
          }
          break;
        case "piezas":
          document.getElementById("descuento").focus();
          break;
        case "descuento":
          mutatePrincipal();
          let ivaNuMaximo, iepsNuMaximo;
          // Si no existe el iva o el ieps le asignamos un valor
          if (data?.articulos[0]) {
            if (data.articulos[0].id_impuesto === 2) {
              ivaNuMaximo = data.articulos[0].nu_maximo;
            } else {
              ivaNuMaximo = 0;
            }
          } else {
            ivaNuMaximo = 0;
          }

          if (data?.articulos[1]) {
            if (data.articulos[1].id_impuesto === 3) {
              iepsNuMaximo = data.articulos[1].nu_maximo;
            } else {
              iepsNuMaximo = 0;
            }
          } else {
            iepsNuMaximo = 0;
          }

          let desc = Number(descRef.current.value),
            piezas = Number(piezasRef.current.value);
          let precioCliente = getPrice(
            selectedRow.a_publico,
            desc,
            ivaNuMaximo,
            iepsNuMaximo
          );
          let total = Number((precioCliente.price * piezas).toFixed(2));
          let datosVenta = {
            vta_caja: caja,
            vta_tran: folio,
            vta_amecop: selectedRow.a_amecop,
            vta_piezas: piezas,
            vta_precio: selectedRow.a_publico,
            vta_importe: piezas,
            vta_iva: precioCliente.iva,
            vta_ieps: precioCliente.ieps,
            vta_descuento: precioCliente.descuento,
            vta_total: total,
          };
     
          // Verifica si el artículo ya existe en la venta
          const articuloYaExiste = dataDetVenta?.detventa?.some(
            (vta) => vta.vta_amecop === datosVenta.vta_amecop
          );

          // Verifica si el artículo no existe en caja y folio que coincidan
          const articuloNoExisteEnCajaYFolio = dataDetVenta?.detventa?.every(
            (vta) =>
              datosVenta.vta_amecop !== vta.vta_amecop &&
              datosVenta.vta_caja === vta.vta_caja &&
              datosVenta.vta_tran === vta.vta_tran
          );

          // Si alguna de las dos condiciones se cumple, envía los datos
          if (!articuloYaExiste || articuloNoExisteEnCajaYFolio) {
            try {
              const respuesta = await enviarDatos(
                `/api/articulos-detventa`,
                datosVenta
              );
              toast.success("Se agregó correctamente.");
              amecopRef.current.value = "";
              piezasRef.current.value = 1;
              setSelectedRow("")
              setPaginaActual(1)
              mutate();
              mutatePrincipal(); // Actualiza la lista principal después de agregar un nuevo artículo
            } catch (error) {
              console.error("Error al agregar el artículo:", error);
              toast.error("Error al agregar el artículo.");
            }
          } else {
            console.error("Transacción no completada: el artículo ya existe.");
            toast.error("Transacción no completada: el artículo ya existe.");
          }

          mutate();
          break;
        default:
      }
    }
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setPaginaActual(page);
    mutatePrincipal();
  };

  // Función para manejar el clic en una fila de la tabla
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setSearchTermino(row.a_amecop);
    setIsOpen(false);
  };

  // Función para actualizar el descuento
  const handleUpdateDesc = (newValue) => {
    setSelectedRow((prevSelectedRow) => ({
      ...prevSelectedRow,
      a_desc: newValue,
    }));
  };

  /** Se filtran los datos para solo mostrar un único amecop **/
  const uniqueArticulos = data?.articulos.reduce((acc, current) => {
    const x = acc.find((item) => item.a_amecop === current.a_amecop);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <div id="ventas">
      {/* Buscador */}
      <div className=" group w-full flex flex-row  gap-2 items-center justify-center rounded-md border-2  border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
        <label className="text-slate-800" htmlFor="busqueda_amecop">
          Busqueda amecop
        </label>
        <div>
          <input
            id="busqueda_amecop"
            className=" w-full m-1 px-3 py-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Buscar..."
            onKeyDown={handleEnter}
            ref={amecopRef}
          />
        </div>
        {isLoading ? (
          <div>
            <div className="">
              <div className="spinnerBusqueda">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
              </div>
            </div>
          </div>
        ) : (
          selectedRow && (
            <p className="font-extrabold">
              <span className="font-bold">Nombre:</span> {selectedRow?.a_nombre}
            </p>
          )
        )}

        <div>
          <label className="text-slate-800" htmlFor="piezas">
            Piezas
          </label>
          <input
            id="piezas"
            className="w-16 m-1 px-3 py-2 border border-gray-300 rounded-md"
            type="number"
            defaultValue={1}
            min={1}
            onKeyDown={handleEnter}
            ref={piezasRef}
            
          />
        </div>
        <div>
          <label className="text-slate-800" htmlFor="descuento">
            % Desc
          </label>
          <input
            id="descuento"
            className=" w-16 m-1 px-3 py-2 border border-gray-300 rounded-md"
            type="text"
            onKeyDown={handleEnter}
            ref={descRef}
            value={ selectedRow?.a_desc || ""}
            placeholder="0"
            onChange={(e) => handleUpdateDesc(e.target.value)}
            onClick={(e) => {
              if (e.target.value === "0") {
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* tabla modal 
amecop nombre precio_publico sector existencia  */}
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex justify-end m-1">
          <button onClick={closeModal}>X</button>
        </div>
        {isLoading ? (
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        ) : (
          <div className="w-full mx-auto  overflow-x-auto">
            <table className=" shadow border border-gray-200 rounded-lg">
              <thead className="text-xs text-gray-400 uppercase bg-gray-100 ">
                <tr>
                  <th className="px-6 py-3 text-left">Amecop</th>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Precio Publico</th>
                  <th className="px-6 py-3 text-left">Sector</th>
                  <th className="px-6 py-3 text-left">Existencia</th>
                </tr>
              </thead>
              <tbody>
                {uniqueArticulos?.map((element, i) => (
                  <tr
                    className="bg-white border-b hover:bg-gray-200"
                    key={element.a_amecop}
                    onClick={() => handleRowClick(element)}
                  >
                    {/* {console.log(element)} */}
                    <td
                      className="px-6 py-4 text-left"
                      key={`td-amecop-${element.a_amecop}`}
                    >
                      {element.a_amecop}
                    </td>

                    <td
                      className="px-6 py-4 text-left"
                      key={`td-nombre-${element.a_amecop}`}
                    >
                      {element.a_nombre}
                    </td>

                    <td
                      className="px-6 py-4 text-left"
                      key={`td-sustancia-${element.a_amecop}`}
                    >
                      {element.a_publico}
                    </td>

                    <td
                      className="px-6 py-4 text-left"
                      key={`td-publico-${element.a_amecop}`}
                    >
                      {element.a_sector}
                    </td>

                    <td
                      className="px-6 py-4 text-left"
                      key={`td-costo-${element.a_amecop}`}
                    >
                      {element.a_existencia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <Pagination
                current={paginaActual} // Página actual
                total={data?.totalItems} // Total de registros
                pageSize={10} // Cantidad de registros por página
                onChange={(page) => handlePageChange(page)} // Función para manejar el cambio de página
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModalVentasTabla;
