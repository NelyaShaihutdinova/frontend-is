import {useEffect, useState} from "react";
import {api} from "../api.js";

const LocationPage = () => {
    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const goToPreviousPage = () => {
        console.log(currentPage)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchData(currentPage - 1)
        }
        console.log(currentPage)
    };

    const goToNextPage = () => {
        console.log(currentPage)
        setCurrentPage(currentPage + 1);
        console.log(currentPage)
        fetchData(currentPage + 1)
    };

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

    const fetchData = async (page) => {
        let filterColomn = document.getElementById("filter-coloumn");
        let filter = document.querySelector("#filter");
        let sorted = document.getElementById("sorted");
        if (filterColomn && filter) {
            filterColomn = filterColomn.value;
            filter = filter.value;
        }
        if (sorted) {
            sorted = sorted.value;
        }
        let url = "?";
        if (filterColomn && filter) {
            url += "&filter-value=" + filter + "&filter-column=" + filterColomn;
        }
        if (page) {
            url += "&page=" + page;
        }
        if (sorted) {
            url += "&sorted=" + sorted;
        }
        if (url === "?") {
            url = "";
        }
        console.log(sorted)
        console.log(url);
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/location/show${url}`, {
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
        fetchPaginationData();
    }, []);

    const createTicket = async () => {
        let x = document.querySelector("#x1");
        let y = document.querySelector("#y1");
        let z = document.querySelector("#z1");

        if (!x.value || isNaN(x.value)) {
            alert("Please enter a x");
            return;
        }
        if (!y.value || isNaN(y.value)) {
            alert("Please enter a y");
            return;
        }
        if (!z.value || isNaN(z.value)) {
            alert("Please enter a z");
            return;
        }

        if (x && y && z) {
            x = parseInt(x.value);
            y = parseInt(y.value);
            z = parseInt(z.value);
        }

        const location = {
            x: x,
            y: y,
            z: z
        }

        const result = await api.post(`/location/create`, location);
        if (result.ok) {
            fetchPaginationData();
        } else {
            const data = await result.json();
            alert(data.message);
        }
    }

    const deleteTicket = async () => {
        let id = document.querySelector("#id3");
        if (!id.value || isNaN(id.value)) {
            alert("Please enter a id");
            return;
        } else {
            id = parseInt(id.value);
        }
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/location/delete/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!(response.ok)) {
            const data = await response.json();
            alert(data.message);
        } else {
            fetchPaginationData();
        }
    }
    const updateTicket = async () => {
        let id = document.querySelector("#id2");
        let x = document.querySelector("#x2");
        let y = document.querySelector("#y2");
        let z = document.querySelector("#z2");

        if (!id.value || isNaN(id.value)) {
            alert("Please enter a id");
            return;
        } else {
            id = parseInt(id.value);
        }
        if (!x.value || isNaN(x.value)) {
            alert("Please enter a x");
            return;
        }
        if (!y.value || isNaN(y.value)) {
            alert("Please enter a y");
            return;
        }
        console.log(z)
        if (!z.value || isNaN(z.value)) {
            alert("Please enter a z");
            return;
        }

        if (x && y && z) {
            x = parseInt(x.value);
            y = parseInt(y.value);
            z = parseInt(z.value);
        }

        const location = {
            x: x,
            y: y,
            z: z
        }

        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/location/update/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(location),
        });

        if (!(response.ok)) {
            const data = await response.json();
            alert(data.message);
        } else {
            fetchPaginationData();
        }
    }

    const fetchPaginationData = async () => {
        console.log(currentPage);
        console.log(typeof currentPage);
        let filterColomn = document.getElementById("filter-coloumn");
        let filter = document.querySelector("#filter");
        let sorted = document.getElementById("sorted");
        if (filterColomn && filter) {
            filterColomn = filterColomn.value;
            filter = filter.value;
        }
        if (sorted) {
            sorted = sorted.value;
        }
        let url = "?";
        if (filterColomn && filter) {
            url += "&filter-value=" + filter + "&filter-column=" + filterColomn;
        }
        if (currentPage) {
            url += "&page=" + currentPage;
        }
        if (sorted) {
            url += "&sorted=" + sorted;
        }
        if (url === "?") {
            url = "";
        }
        console.log(sorted)
        console.log(url);
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/location/show${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const updatedData = replaceNullWithZero(await response.json());
        setData(updatedData);
    };

    return (<>
            <div className="show-table-container">
                <table border="1" style={{width: "100%", textAlign: "left"}}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Creation By</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Z</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item) => (<tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.creationBy}</td>
                        <td>{item.x}</td>
                        <td>{item.y}</td>
                        <td>{item.z}</td>
                    </tr>))}
                    </tbody>
                </table>
                <div className="showBlock">
                    <label>Столбец для фильтрации:
                        <select id="filter-coloumn">
                            <option value="x">X</option>
                            <option value="y">Y</option>
                            <option value="z">Z</option>
                        </select>
                    </label>
                    <br/>
                    <label className="text-field__label" htmlFor="filter"
                    >Фильтрация:
                    </label>
                    <input
                        className="text-field__input ticket"
                        placeholder="filter"
                        type="text"
                        id="filter"
                    />
                    <br/>
                    <label>Столбец для сортировки:
                        <select id="sorted">
                            <option value="id">ID</option>
                            <option value="x">X</option>
                            <option value="y">Y</option>
                            <option value="z">Z</option>
                        </select>
                    </label>
                    <br/>
                    <div style={{marginTop: "20px", display: "flex", justifyContent: "center"}}>
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            style={{marginRight: "10px", background: "#1a1a1a", paddingTop: "0px"}}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            onClick={goToNextPage}
                            style={{marginLeft: "10px", background: "#1a1a1a", paddingTop: "0px"}}
                        >
                            Next
                        </button>
                    </div>
                    <button className="showBtn" onClick={fetchPaginationData}>Show</button>
                </div>
                <div className="createBlock">
                    <div className="createFields">
                        <label className="text-field__label item" htmlFor="x1"
                        >X:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="x"
                            type="text"
                            id="x1"
                        />
                        <br/>
                        <label className="text-field__label item" htmlFor="y1"
                        >Y:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="y"
                            type="text"
                            id="y1"
                        />
                        <br/>
                        <label className="text-field__label item" htmlFor="z1"
                        >Z:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="z"
                            type="text"
                            id="z1"
                        />
                        <br/>
                    </div>
                    <br/>
                    <button className="showBtn" onClick={createTicket}>Create</button>
                </div>
                <div className="updateBlock">
                    <div className="updateFields">
                        <label className="text-field__label item" htmlFor="id2"
                        >ID:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="id"
                            type="text"
                            id="id2"
                        />
                        <br/>
                        <label className="text-field__label item" htmlFor="x2"
                        >X:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="x"
                            type="text"
                            id="x2"
                        />
                        <br/>
                        <label className="text-field__label item" htmlFor="y2"
                        >Y:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="y"
                            type="text"
                            id="y2"
                        />
                        <br/>
                        <label className="text-field__label item" htmlFor="z2"
                        >Z:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="z"
                            type="text"
                            id="z2"
                        />
                        <br/>
                    </div>
                    <br/>
                    <button className="showBtn" onClick={updateTicket}>Update</button>
                </div>
                <div className="deleteBlock">
                    <div className="deleteFields">
                        <label className="text-field__label item" htmlFor="id3"
                        >ID:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="id"
                            type="text"
                            id="id3"
                        />
                        <br/>
                    </div>
                    <br/>
                    <button className="showBtn" onClick={deleteTicket}>Delete</button>
                </div>
            </div>
        </>
    );
}

export default LocationPage;