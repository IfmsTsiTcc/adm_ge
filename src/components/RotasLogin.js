import React from "react";
import { Routes, Route } from "react-router-dom";
import Alterar from "./alterar/senha/alterar/Alterar";
import AlterarSenha from "./alterar/senha/AlterarSenha";
import CadastrarUser from "./cadastros/usuarios/CadastrarUser";
import Login from "./Login";
export default function RotasLogin() {
    return (
        // ROTAS LOGIN
        <Routes>
            {/* rota não encontrada */}
            <Route path="*" element={<Login />} />
            {/* fim rota não encontrada */}

            {/* cadastros  */}
            <Route path="/registrar" element={<CadastrarUser />} />
            {/* fim cadastros  */}

            {/* alteração  */}
            <Route path="/esqueceu-senha" element={<AlterarSenha/>} />
            
            <Route path="/troca-senha/:id" element={<Alterar/>} />

            {/* fim alteração  */}


            {/* login */}
            <Route path="/" element={<Login />} />
            {/* fim login */}
        </Routes>
        // FIM ROTAS LOGIN
    )
}