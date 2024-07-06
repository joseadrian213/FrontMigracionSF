import { useEffect, useState } from "react";
import useArticulo from "../../hooks/useArticulo";
import InputTablas from "../../components/articulos/InputTablas";
import ReactPaginate from "react-paginate";
import "../../css/spinner.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { ModalFormArticulos } from "../../components/articulos/ModalFormArticulos";

export default function Articulos() {
  const {
    data,
    isLoading,
    setDivSeleccionado,
    centrarTabla,
    setCentrarTabla,
    agregarForm,
    setAgregarForm,
    setSearchTerm,
    paginaActual,
    setPaginaActual,
    setResetSelect,
    setBusquedaIva,
    searchTerm
  } = useArticulo();
  
  const [dataForm, setDataForm] = useState([]); // Suponiendo que dataForm es un array de objetos

  const selectInput = (valor) => {
    const datos = {
      a_amecop: valor,
    };
    setBusquedaIva(datos.a_amecop);
    setDivSeleccionado(datos.a_amecop);
    setResetSelect(false); 
    // setEditarForm(true);
    setCentrarTabla(true);
  };

  const agregarInformacion = () => {
    setResetSelect(true); 
    setDivSeleccionado("");
    setCentrarTabla(true);
    setAgregarForm(true);
  };
  

  const manejarCambioPagina = (datos) => {
    setPaginaActual(datos.selected + 1); // `selected` empieza en 0
    console.log(datos.selected);
  };
  const handlePageChange = (page) => {
    // Actualiza la página actual en tu estado
    setPaginaActual(page);
  };

  //Obtener el primer elmento y mostralo en el formulario
  useEffect(() => {
    if (data?.articulos.length > 0) {
      selectInput(data.articulos[0].a_amecop); // Seleccionar el primer elemento
    }
  }, [data]);

  return (
    <div id="articulos"  className=" mx-auto p-6">
      {/* Labels y input */}
      {/* <div className="mb-1 group w-full flex flex-col  gap-1 items-center justify-center rounded-md border-2  border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
        <p className="text-slate-800" id="radio_busqueda">
          Existencia: <span>00</span>
        </p>
        <p className="text-slate-800" id="radio_busqueda">
          Costo Actual: <span>$00</span>
        </p>
        <p className="text-slate-800" id="radio_busqueda">
          Pre.Cliente: <span>$00</span>
        </p>

        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-blue-950 hover:bg-blue-800 text-white rounded-md">
            Calcular
          </button>
        </div>
      </div> */}

      {/* Busqueda contenedor */}
      <div className="group w-full flex flex-col  gap-1 items-center justify-center rounded-md border-2  border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3">
        <label className="text-slate-800" htmlFor="busqueda">
          Busqueda amecop
        </label>
        <input
          id="busqueda"
          className=" w-full m-1 px-3 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>
    <ModalFormArticulos/>

      {isLoading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : (
        <div>
          <div
            className={` flex  gap-2 mt-2 flex-col ${
              centrarTabla ? " md:flex-row" : "md:flex-col items-center"
            }`}
          >
            <div className="w-full mx-auto  overflow-x-auto">
              {/* <table className="w-auto mx-auto font-bold text-sm text-left rtl:text-right text-gray-500 ">
               */}
              <table className=" shadow border border-gray-200 rounded-lg">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 ">
                  <tr>
                    <th className="px-6 py-3 text-left">Amecop</th>
                    <th className="px-6 py-3 text-left">Nombre</th>
                    <th className="px-6 py-3 text-left">Sustancia</th>
                    <th className="px-6 py-3 text-left">Público</th>
                    <th className="px-6 py-3 text-left">Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.articulos?.map((element, i) => (
                    <tr
                      className="bg-white border-b hover:bg-gray-200 "
                      key={element.a_amecop}
                    >
                      <td
                        className="px-6 py-4 text-left"
                        onClick={() => selectInput(element.a_amecop)}
                        key={`td-amecop-${element.a_amecop}`}
                      >
                        {element.a_amecop}
                      </td>

                      <td
                        className="px-6 py-4 text-left"
                        onClick={() => selectInput(element.a_amecop)}
                        key={`td-nombre-${element.a_amecop}`}
                      >
                        {element.a_nombre}
                      </td>

                      <td
                        className="px-6 py-4 text-left"
                        onClick={() => selectInput(element.a_amecop)}
                        key={`td-sustancia-${element.a_amecop}`}
                      >
                        {element.a_sustancia}
                      </td>


                      <td
                        className="px-6 py-4 text-left"
                        onClick={() => selectInput(element.a_amecop)}
                        key={`td-publico-${element.a_amecop}`}
                      >
                        {element.a_publico}
                      </td>

                      <td
                        className="px-6 py-4 text-left"
                        onClick={() => selectInput(element.a_amecop)}
                        key={`td-costo-${element.a_amecop}`}
                      >
                        {element.a_costo}
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

            <div className=" w-full mx-auto">
              {agregarForm ? (
                <InputTablas onChange={agregarForm} />
              ) : (
                data?.articulos.map((element, i) => (
                  <div key={element.a_amecop}>
                    <InputTablas value={element || ""} key={element.a_amecop} />
                  </div>
                ))
              )}
            </div>
             
          </div>

        </div>
      )}
    </div>
  );
}
