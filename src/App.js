import React, { useEffect, useState } from "react";
import Rotas from "./components/Rotas";
import Header from "./components/cabecalho/Header";
import RotasLogin from "./components/RotasLogin";
import { useLocation } from "react-router-dom";
function App() {
  const rotaAtual = useLocation();
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token, rotaAtual.pathname]);
  if (token !== null) {
    return (
      <div className="App">
        <>
          {rotaAtual.pathname?.substring(0, 13) != "/contrato-pdf" && <Header />}
          <Rotas />
        </>
      </div>
    );
  }
  if (token === null) {
    return (
      <div className="App">
        <RotasLogin />
      </div>
    );
  }
}
export default App;
