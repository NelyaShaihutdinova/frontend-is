import {useEffect, useState} from "react";
import {api} from "../api.js";

const AdminPage = () => {
    const [data, setData] = useState([]);

    function replaceNullWithZero(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => replaceNullWithZero(item));
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (obj[key] === null) {
                    obj[key] = 0;
                } else if (typeof obj[key] === 'object') {
                    obj[key] = replaceNullWithZero(obj[key]);
                }
            }
        }
        return obj;
    }

    const fetchData = async () => {
        const response = await fetch(`http://localhost:9814/is-lab1-backend-1.0-SNAPSHOT/api/auth/admin/requests`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const updatedData = replaceNullWithZero(await response.json());
        setData(updatedData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const approveRequest = async () => {
        let id = document.querySelector("#request1");
        if (id) {
            id = parseInt(id.value);
        }
        const response = await fetch(`http://localhost:9814/is-lab1-backend-1.0-SNAPSHOT/api/auth/admin/approve/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!(response.ok)) {
            alert("Проверьте, что Request с введённым ID существует!");
        } else {
            fetchData();
        }
    }

    return (<>
            <div className="show-table-container">
                <table border="1" style={{width: "100%", textAlign: "left"}}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item) => (<tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.status}</td>
                        <td>{item.user.username}</td>
                    </tr>))}
                    </tbody>
                </table>
                <div className="createBlock">
                    <label className="text-field__label item" htmlFor="request1"
                    >Request ID:
                    </label>
                    <input
                        className="text-field__input item"
                        placeholder="request_id"
                        type="text"
                        id="request1"
                    />
                    <br/>
                    <br/>
                    <button className="showBtn" onClick={approveRequest}>Approve</button>
                </div>
            </div>
        </>
    );
}

export default AdminPage;