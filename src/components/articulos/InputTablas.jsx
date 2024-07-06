import React from "react";
import { useState, useEffect, createRef } from "react";
import useArticulo from "../../hooks/useArticulo";
import clientAxios from "../../config/axios";
import useSWR, { mutate } from "swr";
import ModalCaculadora from "../../views/Articulos/ModalCaculadora";
import { toast } from "react-toastify";

export default function InputTablas({ value: valorInicial }) {
  // Estado inicial del artículo, utilizando el valor inicial proporcionado como props
  const [articulo, setArticulo] = useState({
    a_amecop: valorInicial?.a_amecop || "",
    a_nombre: valorInicial?.a_nombre || "",
    a_sustancia: valorInicial?.a_sustancia || "",
    a_sector: valorInicial?.a_sector || "",
    a_publico: valorInicial?.a_publico || "",
    a_costo: valorInicial?.a_costo || "",
    gramaje: valorInicial?.gramaje || "",
    empaque: valorInicial?.empaque || "",
    a_grupo: valorInicial?.a_grupo || "",
    a_local: valorInicial?.a_local || "",
    a_laboratorio: valorInicial?.a_laboratorio || "",
    a_desc: valorInicial?.a_desc || "",
    a_caducidad: valorInicial?.a_caducidad || "",
    a_refrigerado: valorInicial?.a_refrigerado || "",
    vc_unidad: valorInicial?.vc_unidad || "",
    a_iva: valorInicial?.a_iva || "",
    a_ieps: valorInicial?.a_ieps || "",
    a_margen_utilidad: valorInicial?.a_margen_utilidad || "",
    a_tipo_cambio: valorInicial?.a_tipo_cambio || "",
    nu_gramaje: valorInicial?.nu_gramaje || "",
    a_aplica_desc: valorInicial?.a_aplica_desc || "",
  });

  // Desestructuración del estado del artículo para fácil acceso
  const {
    a_amecop,
    a_nombre,
    a_sustancia,
    a_sector,
    a_publico,
    a_costo,
    id_gramaje,
    id_empaque,
    a_grupo,
    a_local,
    a_laboratorio,
    a_desc,
    a_caducidad,
    a_refrigerado,
    vc_unidad,
    a_iva,
    a_ieps,
    a_margen_utilidad,
    a_tipo_cambio,
    nu_gramaje,
    a_aplica_desc,
  } = articulo;

  // Actualiza el estado del artículo cuando cambia el valor inicial
  useEffect(() => {
    setArticulo(valorInicial || {
      a_amecop: "",
      a_nombre: "",
      a_sustancia: "",
      a_sector: "",
      a_publico: "",
      a_costo: "",
      vn_gramaje: "",
      vn_empaque: "",
      nu_gramaje: "",
      a_grupo: "",
      a_local: "",
      a_laboratorio: "",
      a_desc: "",
      a_caducidad: "",
      a_refrigerado: "",
      vc_unidad: "",
      a_iva: "",
      a_ieps: "",
      a_margen_utilidad: "",
      a_tipo_cambio: "",
    });
  }, [valorInicial]);

  // Crear referencias para los campos del formulario
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
  const a_aplica_descRef = createRef();

  // Hook personalizado para manejar lógica del artículo
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
    ivaCal,
    setIVaCal,
    iepsCal,
    setIepsCal,
    descuento,
  } = useArticulo();

  // useEffect para manejar los select y mostrar datos correctamente
  useEffect(() => {
    if (!resetSelect) {
      if (
        dataImpuesto?.articuloImpuesto?.[0]?.id_tc &&
        dataImpuesto?.articuloImpuesto?.[0]?.id_impuesto
      ) {
        setSelectValorIva(
          `${dataImpuesto.articuloImpuesto[0].id_tc},${dataImpuesto.articuloImpuesto[0].id_impuesto}`
        );
        const tasaCuotaIva = data?.tasaCuota?.find(
          (tasaCu) =>
            dataImpuesto.articuloImpuesto[0].id_tc === tasaCu.id_tc &&
            dataImpuesto.articuloImpuesto[0].id_impuesto === tasaCu.id_impuesto
        );
        const valorMaximoIva = tasaCuotaIva ? tasaCuotaIva.nu_maximo : null;
        setIVaCal(valorMaximoIva);
      }
    } else {
      setSelectValorIva(``);
    }
  }, [dataImpuesto]);

  // useEffect para manejar el select de IEPS
  useEffect(() => {
    if (!resetSelect) {
      if (
        dataImpuesto?.articuloImpuesto?.[1]?.id_tc &&
        dataImpuesto?.articuloImpuesto?.[1]?.id_impuesto
      ) {
        setSelectValorIeps(
          `${dataImpuesto.articuloImpuesto[1].id_tc},${dataImpuesto.articuloImpuesto[1].id_impuesto}`
        );
        const tasaCuotaIeps = data?.tasaCuota?.find(
          (tasaCu) =>
            dataImpuesto.articuloImpuesto[1].id_tc === tasaCu.id_tc &&
            dataImpuesto.articuloImpuesto[1].id_impuesto === tasaCu.id_impuesto
        );
        const valorMaximoIeps = tasaCuotaIeps ? tasaCuotaIeps.nu_maximo : null;
        setIepsCal(valorMaximoIeps);
      }
    } else {
      setSelectValorIeps(``);
    }
  }, [dataImpuesto]);

  // Estado para almacenar el valor original de a_amecop
  const [originalA_amecop, setOriginalA_amecop] = useState(a_amecop);

  // Función para manejar el envío de datos al backend
  const handleSubmit = async () => {
    const obtenerToken = () => localStorage.getItem("AUTH_TOKEN");

    const enviarDatos = async (url, datos) => {
      try {
        const token = obtenerToken();
        const response = await clientAxios.put(url, datos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error en la solicitud:", error);
        return { error: true };
      }
    };

    // Datos del artículo a enviar
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
      a_aplica_desc: a_aplica_descRef.current.checked ? 1 : 0,
    };

    // Datos del impuesto IVA
    const [id_tc_iva, id_impuesto_iva] = ivaRef.current.value.split(",");
    const datosArticuloImpuestoIva = {
      a_amecop: a_amecopRef.current.value,
      id_tc: Number(id_tc_iva),
      id_impuesto: Number(id_impuesto_iva),
      vc_impuesto: data?.impuesto[1]?.vc_impuesto || "",
      id_user_add: 1,
      id_user_upd: 1,
    };

    // Datos del impuesto IEPS
    const [id_tc_ieps, id_impuesto_ieps] = iepsRef.current.value.split(",");
    const datosArticuloImpuestoIeps = {
      a_amecop: a_amecopRef.current.value,
      id_tc: Number(id_tc_ieps),
      id_impuesto: Number(id_impuesto_ieps),
      vc_impuesto: data?.impuesto[2]?.vc_impuesto || "",
      id_user_add: 1,
      id_user_upd: 1,
    };

    try {
      const respuesta = await enviarDatos("/api/articulos", datosArticulo);

      if (respuesta && respuesta.success) {
        await enviarDatos("/api/articuloImpuesto", datosArticuloImpuestoIva);
        await enviarDatos("/api/articuloImpuesto", datosArticuloImpuestoIeps);
        toast.success("El artículo ha sido editado exitosamente!");
      }

      mutate("/api/articulos");
      mutate("/api/articuloImpuesto");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error en handleSubmit:", error);
    }
  };

  // Maneja los cambios en los inputs del formulario
  const valorInput = (e) => {
    const { name, value, type, checked } = e.target;
    setArticulo({
      ...articulo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Maneja los cambios en los selects de IVA e IEPS
  const valorSelectArticuloImpuestoIva = (e) => {
    setSelectValorIva(e.target.value);
  };
  const valorSelectArticuloImpuestoIeps = (e) => {
    setSelectValorIeps(e.target.value);
  };

  return (
    <>
      {divSeleccionado === originalA_amecop && ( //crear una condicion de que cuando seaeditrar se habilite cierta edicion y cuando se modifique el amecop para poder editar realizar un copia y no se cierre el div
        <div className=" bg-white mx-auto rounded-lg shadow-md p-6 overflow-y-scroll h-screen">
          <h2 className=" font-bold text-lg uppercase text-center">
            Editar Datos
          </h2>
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
                value={a_amecop || ""}
                onChange={valorInput}
                ref={a_amecopRef}
                disabled
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
                value={a_nombre || ""}
                onChange={valorInput}
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
                value={a_sustancia || ""}
                onChange={valorInput}
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
                value={a_sector || ""}
                name="a_sector"
                onChange={valorInput}
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
                value={a_publico || ""}
                onChange={valorInput}
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
                value={a_costo || ""}
                onChange={valorInput}
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
                value={nu_gramaje || ""}
                onChange={valorInput}
                ref={nu_gramajeRef}
              />
              <select
                onChange={valorInput}
                name="id_gramaje"
                className="mt-2 w-full text-center rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
                value={id_gramaje || ""}
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
                value={id_empaque || ""}
                name="id_empaque"
                onChange={valorInput}
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
                value={a_grupo || ""}
                onChange={valorInput}
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
                value={a_local || ""}
                onChange={valorInput}
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
                value={a_laboratorio || ""}
                onChange={valorInput}
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
              <div className=" flex flex-row">
                <input
                  onChange={valorInput}
                  className="mt-2 w-6 mx-3 rounded-lg p-2"
                  type="checkbox"
                  checked={a_aplica_desc}
                  name="a_aplica_desc"
                  ref={a_aplica_descRef}
                />
                <div className="flex flex-row gap-1">
                  <input
                    className="mt-2 w-full rounded-lg p-2 bg-gray-50 border border-gray-300 font-medium "
                    id="a_desc"
                    name="a_desc"
                    value={descuento ? descuento : isNaN(parseFloat(a_desc))?"":a_desc || ""}
                    onChange={valorInput}
                    ref={a_descRef}
                  />
                  <ModalCaculadora value={valorInicial} />
                </div>
              </div>
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
                value={a_caducidad || ""}
                onChange={valorInput}
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
                value={a_refrigerado || ""}
                onChange={valorInput}
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
                value={a_tipo_cambio || ""}
                name="a_tipo_cambio"
                onChange={valorInput}
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
                value={vc_unidad || ""}
                onChange={valorInput}
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
                name="a_iva"
                onChange={valorSelectArticuloImpuestoIva}
                value={selectValorIva}
                ref={ivaRef}
              >
                <option value="">--seleccione--</option>

                {data?.tasaCuota
                  ?.filter((tasaCu) => tasaCu.id_impuesto === 2) // Asegúrate de que este es el id_impuesto correcto para "Iva"
                  ?.map((tasaCu, i) => (
                    <option
                      key={`id_empaque${a_amecop}${i}`}
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
                name="a_ieps"
                onChange={valorSelectArticuloImpuestoIeps}
                value={selectValorIeps}
                ref={iepsRef}
              >
                <option value="">--seleccione--</option>

                {data?.tasaCuota
                  ?.filter((tasaCu) => tasaCu?.id_impuesto === 3) // Asegúrate de que este es el id_impuesto correcto para "Ieps"
                  ?.map((tasaCu, i) => (
                    <option
                      key={`id_empaque${a_amecop}${i}`}
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
                value={a_margen_utilidad}
                onChange={valorInput}
                ref={a_margen_utilidadRef}
              />
            </div>
          </div>
          <div className="flex justify-center mt-3 ">
            <input
              onClick={handleSubmit}
              defaultValue="Guardar Edicion"
              className="cursor-pointer text-sm text-center p-3 bg-blue-950 hover:bg-blue-800 text-white font-bold py-1 px-1 mb-1 rounded-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
