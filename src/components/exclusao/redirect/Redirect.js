// esse component tem como função apenas fazer um reload no component que realizou uma exclusão para que a mensagem de retorno seja exibida
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
export default function Redirect() {
    const parametro = useParams();
    const redirect = useNavigate();
    useEffect(() => {
        redirect(`/${parametro.url}`)
    }, [])
    return null
}