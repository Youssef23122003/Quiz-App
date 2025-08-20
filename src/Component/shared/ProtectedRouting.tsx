

import { Navigate } from 'react-router-dom';

export default function ProtectedRouting({children}:any) {
    if(localStorage.getItem('token')){
        return children;
    }else{
        return <Navigate to={'/login'}/>
    }

}