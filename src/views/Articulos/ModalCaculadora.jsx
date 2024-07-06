import { useState, useEffect, createRef, useRef } from "react";
import Modal from "react-modal";
import useArticulo from "../../hooks/useArticulo";

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
export default function ModalCaculadora({ value: valorInicial }) {
 // Uso del hook useArticulo para obtener y setear valores relacionados con el artículo
  const {
    descuento,
    setDescuento,
    ivaCal,
    setIVaCal,
    iepsCal,
    setIepsCal,
    margenUtil,
    setMargenUtil,
  } = useArticulo();
  // Estado inicial del artículo con valores por defecto o proporcionados por valorInicial
  const [articulo, setArticulo] = useState({
    a_publico: valorInicial !== undefined ? valorInicial.a_publico : "",
    a_costo: valorInicial !== undefined ? valorInicial.a_costo : "",
    a_desc: valorInicial !== undefined ? valorInicial.a_desc : "",
    a_margen_utilidad:
      valorInicial !== undefined ? valorInicial.a_margen_utilidad : "",
  });
// Desestructuración de las propiedades del artículo
  const {
    a_amecop,
    a_publico,
    a_costo,
    a_desc,
    a_margen_utilidad,
    a_aplica_desc,
  } = articulo;

  // Efecto para actualizar el estado del artículo cuando cambia valorInicial 
  useEffect(() => {
    setArticulo(
      valorInicial !== undefined
        ? valorInicial
        : {
            a_publico: "",
            a_costo: "",
            a_desc: "",
            a_margen_utilidad: "",
          }
    );
  }, [valorInicial]);
    // Variables necesarias para cálculos
  let descto,
    pcte_sin_iva,
    pcte_sin_ivaOP,
    pcte,
    ganPesosOp,
    ganPorcPublic,
    gananciaPorcentajeCostoOp;
  let margen = Number(a_margen_utilidad);
  let precioPublico = Number(a_publico);
  let precioCosto = Number(a_costo);

  // Estados para almacenar diferentes valores calculados
  const [gananciaPesos, setGananciaPesos] = useState("");
  const [gananciaPorcentajePublic, setGananciaPorcentajePublic] = useState("");
  const [gananciaPorcentajeCosto, setGananciaPorcentajeCosto] = useState("");
  const [precioCliente, setPrecioCliente] = useState("");
  const [precioFinalCliente, setPrecioFinalCliente] = useState("");
  const [descOp, setDescOp] = useState("");
  const [gananciaPesosInput, setGananciaPesosInput] = useState("");
  const [gananciaPorcentajePublicInput, setGananciaPorcentajePublicInput] =
    useState("");
  const [gananciaPorcentajeCostoInput, setGananciaPorcentajeCostoInput] =
    useState("");
  const [precioClienteInput, setPrecioClienteInput] = useState("");
  const [precioFinalClienteInput, setPrecioFinalClienteInput] = useState("");
  const [descuentoInput, setDescuentoInput] = useState("");
  const [precioPublicoInput,setPrecioPublicoInput]=useState("");

  // Función para manejar el cambio de valores en los inputs y actualizar el estado del artículo
  const valorInput = (e) => {
    const { name, value } = e.target;
    setArticulo({
      ...articulo,
      [name]: value,
    });
    switch (name) {
      case "desc":
        setDescOp(Number(value));
        break;
      case "ganancia_pesos":
        setGananciaPesos(Number(value));
        break;
      case "ganacia_porcentaje_public":
        setGananciaPorcentajePublic(Number(value));
        break;
      case "ganacia_porcentaje_costo":
        setGananciaPorcentajeCosto(Number(value));
        break;
      case "precio_cliente":
        setPrecioCliente(Number(value));
        break;
      case "precio_final_cliente":
        setPrecioFinalCliente(Number(value));
        break;
      default:
        setArticulo({
          ...articulo,
          [name]: value,
        });
    }
  };

  // gan_prc = ganancia en  porcentaje publico
  // gan_prc_cost = ganancia en  porcentaje costo
  // pbbu = precio publico
  // pcosto= precio costo
  // margen =margen utilidad
  // gan_peso= ganancia en pesos
  // Función para calcular el precio con descuento, IVA y IEPS aplicados
  const getPrice = (precioPublico, descto, ivaCal, iepsCal) => {
    let price;
    let descuento = Number((precioPublico * descto * -1.0).toFixed(2));
    let iva = Number(((precioPublico + descuento) * ivaCal).toFixed(2));
    let ieps = Number(((precioPublico + descuento) * iepsCal).toFixed(2));
    price = precioPublico + iva + ieps + descuento;
    console.log(price);
    
    return price;
  };
  // Función para obtener el descuento aplicado al cliente
  const getDescuentoByPClient = (precioPublico, price, ivaCal, iepsCal) => {
    let des = (precioPublico - price / (ivaCal + iepsCal + 1)) / precioPublico;
    return des;
  };
 // Efecto para recalcular valores cuando alguno de los estados dependientes cambia
  useEffect(() => {
    calculos();
  }, [
    descOp,
    gananciaPesos,
    gananciaPorcentajePublic,
    gananciaPorcentajeCosto,
    precioCliente,
  ]);
  // Función principal para realizar los cálculos necesarios
    const calculos = () => {

        if (!a_aplica_desc) {
          margen =
            precioPublico > 0
              ? ((precioPublico - precioCosto) / precioPublico) * 100
              : 0.0;

            
          if (gananciaPorcentajePublic> 0) {
            descto=0.00;
            pcte_sin_iva = precioPublico;
            ganPesosOp=Number((pcte_sin_iva - precioCosto).toFixed(2));
            pcte =(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            console.log(pcte);

            // gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100
            gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100

          } else if (gananciaPorcentajeCosto > 0) {
            descto=0.00;
            pcte_sin_iva =
            precioCosto + (precioCosto * (gananciaPorcentajeCosto / 100));
            ganPesosOp= Number((pcte_sin_iva - precioCosto).toFixed(2));
            // pcte = getPrice(precioPublico, descto / 100, ivaCal, iepsCal);
            pcte =(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            console.log(pcte);


          }else if (gananciaPesos>0) {
            descto=0.00;
            pcte_sin_iva =Number((precioCosto + gananciaPesos).toFixed(2)) ;
            ganPorcPublic=Number(margen.toFixed(2))
            // pcte=getPrice(precioPublico, descto / 100, ivaCal, iepsCal);
            pcte =(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            console.log(precioPublico);
            gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100

            // gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100
            console.log(pcte);

          }
          else if (precioCliente > 0) {
            descto=0.00;
            ganPorcPublic= Number(margen.toFixed(2));
            precioPublico = (precioCliente / (1 + ivaCal + iepsCal)).toFixed(2);
            pcte_sin_ivaOP = precioPublico;
            ganPesosOp=Number((pcte_sin_ivaOP - precioCosto).toFixed(2));
            gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100 
            console.log(precioPublico,descto,ivaCal,iepsCal);
            pcte =parseFloat(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            // pcte = Math.round(pcte * 100) / 100;
  
            
            setPrecioPublicoInput(precioPublico)
            //No existe el descuento
            // gananciaPorcentajeCostoOp=((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100

          }else if (descOp> 0) {
            // Nuevo bloque para cuando descuento > 0
            pcte_sin_iva =( precioPublico - (precioPublico * (descOp / 100))).toFixed(2);
            ganPesosOp = Number((pcte_sin_iva - precioCosto).toFixed(2));
            ganPorcPublic = Number(((pcte_sin_iva - precioCosto) / pcte_sin_iva * 100).toFixed(2));
            // pcte = getPrice(precioPublico, descOp / 100, ivaCal, iepsCal);
            pcte = (getPrice(precioPublico, descOp / 100, ivaCal, iepsCal)).toFixed(2);

            //Psoble error por el ternario
            gananciaPorcentajeCostoOp=(((precioPublico - (precioPublico * (descOp/ 100)) - precioCosto) / precioCosto) * 100 ).toFixed(2);
            // console.log(pcte_sin_iva,ganPesosOp,ganPorcPublic,gananciaPorcentajePublic,pcte,gananciaPorcentajeCostoOp);
 
        }

          // let desc=0
          // let prcreal=margen-descuento
          // let  gananciaPorcentajeCostoOp,precioClienteOp,precioFinalClienteOp,gananciaPesosOp
          // gananciaPorcentajeCostoOp=  ((precioPublico-(precioPublico*(desc/100))-precioCosto)/precioCosto)*100
          // precioClienteOp=precioPublico-(precioPublico*(desc/100))
          // precioFinalClienteOp=getPrice(precioPublico,(desc/100),ivaCal,iepsCal)
          // gananciaPesosOp=Number((pcte_sin_iva-precioCosto))
          // // console.log(ivaCal,iepsCal);
          //   console.log(gananciaPorcentajeCostoOp,precioClienteOp,precioFinalClienteOp,gananciaPesosOp);
          // setGananciaPorcentajePublicInput(Number(prcreal.toFixed(2)))
          // setGananciaPorcentajeCostoInput(gananciaPorcentajeCostoOp)
          // setPrecioClienteInput(precioClienteOp)
          // setPrecioFinalClienteInput(precioFinalClienteOp)
          // setGananciaPesosInput(gananciaPesosOp)

        }else {
          if (gananciaPorcentajePublic > 0) {
            descto =( margen - gananciaPorcentajePublic).toFixed(2);
            pcte_sin_iva = (precioPublico -(precioPublico * (descto / 100))).toFixed(2);
            ganPesosOp= Number((pcte_sin_iva - precioCosto).toFixed(2));
            pcte =(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            gananciaPorcentajeCostoOp=(((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100).toFixed(2)

          } else if (gananciaPorcentajeCosto > 0) {
            pcte_sin_iva =
            (  precioCosto + (precioCosto * (gananciaPorcentajeCosto / 100))).toFixed(2);
            descto = (((precioPublico - pcte_sin_iva) / precioPublico) * 100).toFixed(2);
            ganPesosOp= Number((pcte_sin_iva - precioCosto).toFixed(2));
            pcte =(getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            let prcreal = margen - descto;
            ganPorcPublic= Number(prcreal.toFixed(2));

          } else if (gananciaPesos > 0) {
            pcte_sin_iva = Number((precioCosto + gananciaPesos).toFixed(2));
            descto = (((precioPublico - pcte_sin_iva) / precioPublico) * 100).toFixed(2);
            let prcreal = margen - descto;
            ganPorcPublic= Number(prcreal.toFixed(2));
            pcte =( getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            gananciaPorcentajeCostoOp=(((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100).toFixed(2)
       

          } else if (precioCliente > 0) {
            descto =( getDescuentoByPClient(precioPublico, precioCliente, ivaCal, iepsCal)).toFixed(2);
            let prcreal = margen - descto;
            ganPorcPublic =Number(prcreal.toFixed(2));
            pcte_sin_ivaOP = precioPublico -( precioPublico * (descto / 100));
            ganPesosOp= Number((pcte_sin_ivaOP - precioCosto).toFixed(2));//OPERACION DE DESCUENTO VENTAS
            pcte =( getPrice(precioPublico, descto / 100, ivaCal, iepsCal)).toFixed(2);
            gananciaPorcentajeCostoOp=(((precioPublico-(precioPublico*(descto/100))-precioCosto)/precioCosto)*100).toFixed(2)

          }
          else if (descOp> 0) {
            // Nuevo bloque para cuando descuento > 0
            pcte_sin_iva =( precioPublico - (precioPublico * (descOp / 100))).toFixed(2);
            ganPesosOp = Number((pcte_sin_iva - precioCosto).toFixed(2));
            ganPorcPublic = Number(((pcte_sin_iva - precioCosto) / pcte_sin_iva * 100).toFixed(2));
            pcte = (getPrice(precioPublico, descOp / 100, ivaCal, iepsCal)).toFixed(2);
            gananciaPorcentajeCostoOp=(((precioPublico - (precioPublico * (descOp/ 100)) - precioCosto) / precioCosto) * 100 )?.toFixed(2);
            // console.log(pcte_sin_iva,ganPesosOp,ganPorcPublic,gananciaPorcentajePublic,pcte,gananciaPorcentajeCostoOp);

        }

  };

  setDescuentoInput(descto)
  setPrecioClienteInput(pcte_sin_iva)
  setPrecioFinalClienteInput(pcte)
  setGananciaPesosInput(ganPesosOp)
  setGananciaPorcentajePublicInput(ganPorcPublic)
  setGananciaPorcentajeCostoInput(gananciaPorcentajeCostoOp)
    }

  const resetBtn = () => {
    setGananciaPesos("");
    setGananciaPorcentajePublic("");
    setGananciaPorcentajeCosto("");
    setPrecioCliente("");
    setPrecioFinalCliente("");
    setDescOp("");
    setGananciaPesosInput("");
    setGananciaPorcentajePublicInput("");
    setGananciaPorcentajeCostoInput("");
    setPrecioClienteInput("");
    setPrecioFinalClienteInput("");
    setDescuentoInput("");
  };
//Si existe descuento input se colocara el nuevo descuento asignado por el usuario 
  const aceptarBtn = () => {
    if (descuentoInput) {
      setDescuento(descuentoInput);
      setIsOpen(false);
    } else if (descOp) {
      setDescuento(descOp);
      setIsOpen(false);
    }
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   Modal.setAppElement("#articulos");
  // }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <div>
        <button
          onClick={openModal}
          className="mt-2 w-full rounded-lg p-2 bg-blue-950 hover:bg-blue-800 text-white "
        >
          Calcular
        </button>
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

        <p className="text-slate-800 text-center text-lg font-bold uppercase">
          Calcular Descuento
        </p>
        <p className="text-slate-800 text-center text-base font-bold uppercase">
          Amecop {a_amecop}
        </p>
        <div className="grid grid-cols-2 gap-5 mx-auto rounded-lg p-6">
          <div>
            <label className="text-slate-800 text-sm font-bold uppercase ">
              Precio Publico
            </label>
            <p className=" text-slate-800 text-2xl font-bold ">${precioPublicoInput?precioPublicoInput: a_publico}</p>
          </div>
          <div>
            <label className="text-slate-800 text-sm font-bold uppercase ">
              Precio Costo
            </label>
            <p className=" text-slate-800 text-2xl font-bold ">${a_costo}</p>
          </div>
          <div>
            <label className="text-slate-800 text-sm font-bold uppercase ">
              Margen Utilidad
            </label>
            <p className=" text-slate-800 text-2xl font-bold ">
              {(a_margen_utilidad)?.toFixed(2)}%
            </p>
          </div>

          <div>
            <label
              htmlFor="desc"
              className="text-slate-800 text-sm font-bold uppercase "
            >
              Descuento al Cliente
            </label>

            <input
              className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
              id="desc"
              name="desc"
              type="number"
              value={descOp || descuentoInput || ""}
              onChange={valorInput}
              disabled={!a_aplica_desc}
              
            />
          </div>
          <div>
            <label
              htmlFor="ganancia_pesos"
              className="text-slate-800 text-sm font-bold uppercase "
            >
              Ganancia en Pesos
            </label>
            <input
              className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
              id="ganancia_pesos"
              name="ganancia_pesos"
              type="number"
              value={gananciaPesosInput || gananciaPesos || ""}
              onChange={valorInput}
              // ref={gananciaPesosRef}
              // onChange={valorInput}
            />
          </div>
          <div>
            <label
              htmlFor="ganacia_porcentaje_public"
              className="text-slate-800 text-sm font-bold uppercase "
            >
              Ganancia en Porcentaje Publico
            </label>
            <input
              className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
              id="ganacia_porcentaje_public"
              name="ganacia_porcentaje_public"
              // onChange={valorInput}
              onChange={valorInput}
              // ref={gananciaPorcentajePublicRef}
              type="number"
              value={
                gananciaPorcentajePublicInput || gananciaPorcentajePublic || ""
              }
            />
          </div>

          <div>
            <label
              htmlFor="ganacia_porcentaje_costo"
              className="text-slate-800 text-sm font-bold uppercase "
            >
              Ganancia en Porcentaje Costo
            </label>
            <input
              className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
              id="ganacia_porcentaje_costo"
              name="ganacia_porcentaje_costo"
              // onChange={valorInput}
              onChange={valorInput}
              type="number"
              // ref={gananciaPorcentajeCostoRef}
              value={
                gananciaPorcentajeCostoInput || gananciaPorcentajeCosto || ""
              }
            />
          </div>

          <div>
            <label
              htmlFor="precio_cliente"
              className="text-slate-800 text-sm font-bold uppercase "
            >
              Precio al Cliente
            </label>
            <input
              className="mt-2 w-full rounded-lg p-2 bg-gray-50 border block border-gray-300 font-medium "
              id="precio_cliente"
              name="precio_cliente"
              value={precioClienteInput || precioCliente || ""}
              onChange={valorInput}
              type="number"
              // ref={precioClienteRef}
              // onChange={valorInput}
            />
          </div>

          <div>
            <label className="text-slate-800 text-sm font-bold uppercase ">
              Precio Final con Iva y Ieps
            </label>
            <p className=" text-slate-800 text-2xl font-bold ">
              ${precioFinalClienteInput}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          {/* <button
              onClick={calculos}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-800 text-white rounded-md"
            >
              Calcular
            </button> */}
          <button
            onClick={resetBtn}
            className="px-4 py-2 w-full bg-blue-950 hover:bg-blue-800 text-white rounded-md"
          >
            Resetear
          </button>

          <button
            onClick={aceptarBtn}
            className="px-4 py-2 w-full bg-blue-950 hover:bg-blue-800 text-white rounded-md"
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </div>
  );
}
