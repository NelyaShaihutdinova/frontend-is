import {useEffect, useRef, useState} from "react";
import {redirect} from "react-router-dom";
import {buildUrl, getData, postData} from "../utils/fetch.js";

const AdminPage = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const idRef = useRef(null);
    useEffect(() => {
        fetchData();
    }, []);
    if (role !== 'ADMIN') {
        return redirect('/entity');
    }

    const fetchData = async () => {
        const url = '/auth/admin/requests';
        const buildedUrl = buildUrl(url);
        const updatedData = await getData(buildedUrl, token);
        setData(updatedData);
    };


    const approveRequest = async () => {
        const id = idRef.current?.value;

        if (!id || isNaN(id)) {
            alert("Please enter a valid ID");
            return;
        }

        const url = `/auth/admin/approve/${id}`;
        const response = await postData(url);
        if (!(response.ok)) {
            alert("Admin request with this id not found");
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
                <div className="block">
                    <label className="text-field__label item"
                    >Request ID:
                    </label>
                    <input
                        className="text-field__input item"
                        placeholder="request_id"
                        type="text"
                        ref={idRef}
                    />
                    <br/>
                    <br/>
                    <button className="btn" onClick={approveRequest}>Approve</button>
                </div>
            </div>
        </>
    );
}

export default AdminPage;