
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TablaArticulos() {


function EditableCell({ value: initialValue, row: { index }, column: { id }, updateData }) {
    const [value, setValue] = useState(initialValue);

    const onChange = e => {
        setValue(e.target.value);
    };

    const onBlur = () => {
        updateData(index, id, value);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    {/*onBlur={onBlur}} */}
    return <input value={value} onChange={onChange}  />
}

function UserTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/api/users')
            .then(response => {
                setData(response.data);
            });
    }, []);

    const updateData = (rowIndex, columnId, value) => {
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    };

}
return (
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                {/* Añade aquí más columnas según sea necesario */}
            </tr>
        </thead>
        <tbody>
            {data.map((row, i) => (
                <tr key={row.id}>
                    <EditableCell value={row.name} row={{ index: i }} column={{ id: 'name' }} updateData={updateData} />
                    <EditableCell value={row.email} row={{ index: i }} column={{ id: 'email' }} updateData={updateData} />
                    {/* Añade aquí más celdas según sea necesario */}
                </tr>
            ))}
        </tbody>
    </table>
);
}

