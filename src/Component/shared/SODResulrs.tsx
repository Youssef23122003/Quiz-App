

import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import Results from '../../Modules/Student/Results/Results';

export default function SODResulrs({children}:any) {

    
 const user = useSelector((state: RootState) => state.auth.LogData);


 
    if(user?.role !== "Student"){
        return children;
    }else{
        return <Results/>
    }

}