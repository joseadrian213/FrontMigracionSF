import { useContext } from "react";
import ArticuloContext from "../context/ArticuloProvider";

const useArticulo=() => {
    return useContext(ArticuloContext)
}
export default useArticulo