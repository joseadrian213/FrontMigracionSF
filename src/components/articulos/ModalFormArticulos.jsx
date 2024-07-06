import React, { useState, useEffect, createRef } from "react";
import Modal from "react-modal";
import useArticulo from "../../hooks/useArticulo";
import clientAxios from "../../config/axios";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import Alerta from "../Alerta";

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

/**
 * Componente para el formulario modal de artículos
 */
export const ModalFormArticulos = () => {
  const {
    divSeleccionado,
    data,
    dataImpuesto,
    selectValorIva,
    setSelectValorIva,
    selectValorIeps,
    setSelectValorIeps,
    resetSelect,
    busquedaIva,
  } = useArticulo();

  // Referencias para los campos del formulario
  const a_amecopRef = createRef();
  const a_nombreRef = createRef();
  const a_sustanciaRef = createRef();
  const a_sectorRef = createRef();
  const a_publicoRef = createRef();
  const a_costoRef = createRef();
  const nu_gramajeRef = createRef();
  const id_gramajeRef = createRef();
  const id_empaqueRef = createRef();
  const a_grupoRef = createRef();
  const a_localRef = createRef();
  const a_laboratorioRef = createRef();
  const a_descRef = createRef();
  const a_caducidadRef = createRef();
  const a_refrigeradoRef = createRef();
  const vc_unidadRef = createRef();
  const ivaRef = createRef();
  const iepsRef = createRef();
  const a_margen_utilidadRef = createRef();

  // Estado para manejar los errores de la alerta
  const [errorAlerta, setErrorAlerta] = useState("");

  /**
   * Función para enviar datos a la API.
   *
   * @param {string} url - URL de la API.
   * @param {Object} datos - Datos a enviar.
   * @returns {Object} - Respuesta de la API.
   */
  const enviarDatos = async (url, datos) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    try {
      const response = await clientAxios.post(url, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setErrorAlerta(error.response.data.errors);
      return { error: error.message };
    }
  };

  // Limpiar la alerta de errores después de 10 segundos
  if (errorAlerta) {
    setTimeout(() => {
      setErrorAlerta("");
    }, 10000);
  }

  /**
   * Convertir un valor a número.
   *
   * @param {string} value - Valor a convertir.
   * @returns {number} - Valor convertido.
   */
  const convertToNumber = (value) => {
    if (value === "" || value === undefined) {
      return NaN;
    } else {
      return Number(value);
    }
  };

  /**
   * Manejar el envío del formulario.
   */
  const handleSubmit = async () => {
    const datosArticulo = {
      a_amecop: a_amecopRef.current.value,
      a_nombre: a_nombreRef.current.value,
      a_sustancia: a_sustanciaRef.current.value,
      a_sector: a_sectorRef.current.value,
      a_publico: a_publicoRef.current.value,
      a_costo: a_costoRef.current.value,
      nu_gramaje: nu_gramajeRef.current.value,
      id_gramaje: id_gramajeRef.current.value,
      id_empaque: id_empaqueRef.current.value,
      a_grupo: a_grupoRef.current.value,
      a_local: a_localRef.current.value,
      a_laboratorio: a_laboratorioRef.current.value,
      a_desc: a_descRef.current.value,
      a_caducidad: a_caducidadRef.current.value,
      a_refrigerado: a_refrigeradoRef.current.value,
      vc_unidad: vc_unidadRef.current.value,
      a_margen_utilidad: a_margen_utilidadRef.current.value,
    };

    const [id_tc_iva, id_impuesto_iva] = ivaRef.current.value.split(",");
    const [id_tc_ieps, id_impuesto_ieps] = iepsRef.current.value.split(",");

    const datosArticuloImpuestoIva = {
      a_amecop: a_amecopRef.current.value,
      id_tc: isNaN(convertToNumber(id_tc_iva)) && 1,
      id_impuesto: isNaN(convertToNumber(id_impuesto_iva)) && 2,
      vc_impuesto: data?.impuesto[1].vc_impuesto,
      id_user_add: 1,
      id_user_upd: 1,
    };
    const datosArticuloImpuestoIeps = {
      a_amecop: a_amecopRef.current.value,
      id_tc: isNaN(convertToNumber(id_tc_ieps)) && 16,
      id_impuesto: isNaN(convertToNumber(id_impuesto_ieps)) && 3,
      vc_impuesto: data?.impuesto[2].vc_impuesto,
      id_user_add: 1,
      id_user_upd: 1,
    };

    const respuesta = await enviarDatos(`/api/articulos`, datosArticulo);
    if (respuesta && respuesta.success) {
      await enviarDatos(`/api/articuloImpuesto`, datosArticuloImpuestoIva);
      await enviarDatos(`/api/articuloImpuesto`, datosArticuloImpuestoIeps);
      toast.success("El artículo ha sido creado exitosamente!");
      setIsOpen(false);
    }
    mutate("/api/articulos");
    mutate("/api/articuloImpuesto");
  };

  /**
   * Manejar cambios en los campos de entrada.
   *
   * @param {Event} e - Evento de cambio.
   */
  const valorInput = (e) => {
    const { name, value } = e.target;
    setArticulo({
      ...articulo,
      [name]: value,
    });
  };

  /**
   * Manejar cambios en el select de IVA.
   *
   * @param {Event} e - Evento de cambio.
   */
  const valorSelectArticuloImpuestoIva = (e) => {
    setSelectValorIva(e.target.value);
  };

  /**
   * Manejar cambios en el select de IEPS.
   *
   * @param {Event} e - Evento de cambio.
   */
  const valorSelectArticuloImpuestoIeps = (e) => {
    setSelectValorIeps(e.target.value);
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  // Configurar el elemento raíz para el modal cuando se monta el componente
  useEffect(() => {
    Modal.setAppElement("#articulos");
  }, []);

  /**
   * Abrir el modal.
   */
  function openModal() {
    setIsOpen(true);
  }

  /**
   * Cerrar el modal.
   */
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <div className="flex justify-end m-1">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-950 hover:bg-blue-800 text-white rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" overflow-y-scroll">
          <div className="flex justify-end m-1">
            <button onClick={closeModal}>X</button>
          </div>
          <h2 className=" font-bold text-lg uppercase text-center">
            {" "}
            Editar Datos
          </h2>
          {/* { divSeleccionado &&setOriginalA_amecop(divSeleccionado) }  */}
          {/* {errorAlerta&& <Alerta>{errorAlerta} </Alerta>} */}
          {errorAlerta &&
            Object.keys(errorAlerta).map((key) => (
              <Alerta key={key}>{`${key}: ${errorAlerta[key]}`}</Alerta>
            ))}

          <div className=" bg-white mx-auto rounded-lg  p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div>
                <label
                  htmlFor="a_amecop"
                  className="text-slate-800 text-sm font-bold uppercase "
                >
                  Amecop
                </label>
                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_amecop"
                  name="a_amecop"
                  // onChange={valorInput}
                  ref={a_amecopRef}
                  maxLength={15}
                />
              </div>
              <div>
                <label
                  htmlFor="a_nombre"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Nombre
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_nombre"
                  name="a_nombre"
                  // onChange={valorInput}
                  ref={a_nombreRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_sustancia"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Sustancia
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_sustancia"
                  name="a_sustancia"
                  // onChange={valorInput}
                  ref={a_sustanciaRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_sector"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Sector
                </label>

                <select
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_sector"
                  name="a_sector"
                  // onChange={valorInput}
                  ref={a_sectorRef}
                >
                  <option value="">--seleccione--</option>
                  {data?.sectores?.map((element, i) => (
                    <option
                      // ref={gramajeRef}
                      key={`vn_gramaje${element.a_amecop}${i}`}
                      value={element.s_sector}
                    >
                      {element.s_nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="a_publico"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Publico
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_publico"
                  name="a_publico"
                  // onChange={valorInput}
                  ref={a_publicoRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_costo"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Costo
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_costo"
                  name="a_costo"
                  // onChange={valorInput}
                  ref={a_costoRef}
                />
              </div>
              <div>
                <label
                  htmlFor="nu_gramaje"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Gramaje
                </label>
                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="nu_gramaje"
                  name="nu_gramaje"
                  // onChange={valorInput}
                  ref={nu_gramajeRef}
                />
                <select
                  // onChange={valorInput}
                  name="id_gramaje"
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  ref={id_gramajeRef}
                >
                  <option value="">--seleccione--</option>
                  {data?.gramaje?.map((element, i) => (
                    <option
                      // ref={gramajeRef}
                      key={`vn_gramaje${element.a_amecop}${i}`}
                      value={element.id_gramaje}
                    >
                      {element.vn_gramaje}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="id_empaque"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Empaque
                </label>
                <select
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="id_empaque"
                  name="id_empaque"
                  // onChange={valorInput}
                  ref={id_empaqueRef}
                >
                  <option value="">--seleccione--</option>
                  {data?.empaque?.map((element, i) => (
                    <option
                      // ref={gramajeRef}
                      key={`id_empaque${element.a_amecop}${i}`}
                      value={element.id_empaque}
                    >
                      {element.vn_empaque}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="a_grupo"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Grupo
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_grupo"
                  name="a_grupo"
                  // onChange={valorInput}
                  ref={a_grupoRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_local"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Local
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_local"
                  name="a_local"
                  // onChange={valorInput}
                  ref={a_localRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_laboratorio"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Laboratorio
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_laboratorio"
                  name="a_laboratorio"
                  // onChange={valorInput}
                  ref={a_laboratorioRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_desc"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Desc
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_desc"
                  name="a_desc"
                  // onChange={valorInput}
                  ref={a_descRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_caducidad"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Caducidad
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_caducidad"
                  name="a_caducidad"
                  // onChange={valorInput}
                  ref={a_caducidadRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_refrigerado"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Refrigerado
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_refrigerado"
                  name="a_refrigerado"
                  // onChange={valorInput}
                  ref={a_refrigeradoRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_tipo_cambio"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Camb.Precio
                </label>

                <select
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_tipo_cambio"
                  name="a_tipo_cambio"
                  // onChange={valorInput}
                >
                  <option value="">--seleccione--</option>

                  <option
                    // ref={gramajeRef}
                    value="0"
                  >
                    Normal
                  </option>
                  <option
                    // ref={gramajeRef}
                    value="3"
                  >
                    Sin Cambio
                  </option>
                  <option
                    // ref={gramajeRef}
                    value="4"
                  >
                    Precio Costo Fijo
                  </option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="vc_unidad"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Unidad
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="vc_unidad"
                  name="vc_unidad"
                  // onChange={valorInput}
                  ref={vc_unidadRef}
                />
              </div>
              <div>
                <label
                  htmlFor="a_iva"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Iva
                </label>
                <select
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium"
                  id="a_iva"
                  name="a_iva"
                  onChange={valorSelectArticuloImpuestoIva}
                  ref={ivaRef}
                >
                  <option value="">--seleccione--</option>

                  {data?.tasaCuota
                    ?.filter((tasaCu) => tasaCu?.id_impuesto === 2) // Asegúrate de que este es el id_impuesto correcto para "Iva"
                    .map((tasaCu, i) => (
                      <option
                        key={`id_empaque${i}`}
                        value={`${tasaCu.id_tc},${tasaCu.id_impuesto}`}
                      >
                        {tasaCu.nu_maximo}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="a_ieps"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Ieps
                </label>

                <select
                  className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium"
                  id="a_ieps"
                  name="a_ieps"
                  onChange={valorSelectArticuloImpuestoIeps}
                  ref={iepsRef}
                >
                  <option value="">--seleccione--</option>

                  {data?.tasaCuota
                    ?.filter((tasaCu) => tasaCu?.id_impuesto === 3) // Asegúrate de que este es el id_impuesto correcto para "Ieps"
                    ?.map((tasaCu, i) => (
                      <option
                        key={`id_empaque${i}`}
                        value={`${tasaCu.id_tc},${tasaCu.id_impuesto}`}
                      >
                        {tasaCu.nu_maximo}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="a_margen_utilidad"
                  className="text-slate-800 uppercase text-sm font-bold"
                >
                  Margen Utilidad
                </label>

                <input
                  className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                  id="a_margen_utilidad"
                  name="a_margen_utilidad"
                  // onChange={valorInput}
                  ref={a_margen_utilidadRef}
                />
              </div>
            </div>
            <div className="flex justify-center mt-3 ">
              <input
                onClick={handleSubmit}
                defaultValue="Guardar"
                className="cursor-pointer text-sm text-center p-3 bg-blue-950 hover:bg-blue-800 text-white font-bold py-1 px-1 mb-1 rounded-full"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

