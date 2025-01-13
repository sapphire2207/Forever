import { createContext, useState } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [list, setList] = useState([]);

    const value = {
        list, setList
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider