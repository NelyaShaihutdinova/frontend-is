import {useEffect, useState} from "react";
import {api} from "../api.js";

const VenuePage = () => {
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/show`, {
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

        const createTicket = async () => {
            let name = document.querySelector("#name1");
            let capacity = document.querySelector("#capacity1");
            let venueType = document.getElementById("venueType1");

            if (!name.value) {
                alert("Please enter a name");
                return;
            }
            if (!capacity.value || isNaN(capacity.value) || Number(capacity.value) <= 0) {
                alert("Please enter a capacity");
                return;
            }


            if (name && capacity && venueType) {
                name = name.value;
                capacity = parseInt(capacity.value);
                venueType = venueType.value;
            }

            const venue = {
                name: name,
                capacity: capacity,
                venueType: venueType,
            }

            const result = await api.post(`/venue/create`, venue);
            console.log(result)
            if (result.ok) {
                fetchData();
            } else {
                alert(result.message);
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/delete/${id}`, {
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
                fetchData();
            }
        }

        const updateTicket = async () => {
            let id = document.querySelector("#id2");
            let name = document.querySelector("#name2");
            let capacity = document.querySelector("#capacity2");
            let venueType = document.getElementById("venueType2");
            if (!id.value || isNaN(id.value)) {
                alert("Please enter a id");
                return;
            } else {
                id = parseInt(id.value);
            }
            if (!name.value) {
                alert("Please enter a name");
                return;
            }
            if (!capacity.value || isNaN(capacity.value) || Number(capacity.value) <= 0) {
                alert("Please enter a capacity");
                return;
            }

            if (id && name && capacity && venueType) {
                name = name.value;
                capacity = parseInt(capacity.value);
                venueType = venueType.value;
            }

            const venue = {
                name: name,
                capacity: capacity,
                venueType: venueType,
            }

            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(venue),
            });

            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchData();
            }
        }

        const fetchPaginationData = async () => {
            let filterColomn = document.getElementById("filter-coloumn");
            let filter = document.querySelector("#filter");
            let page = document.querySelector("#pagination");
            let sorted = document.getElementById("sorted");
            if (filterColomn && filter) {
                filterColomn = filterColomn.value;
                filter = filter.value;
            }
            if (page) {
                page = page.value;
            }
            if (sorted) {
                sorted = sorted.value;
            }
            let url = "?";
            if (filterColomn && filter) {
                url += "&filter-value=" + filter + "&filter-column=" + filterColomn;
            }
            if (page) {
                if (parseInt(Number(page)) == page) {
                    url += "&page=" + page;
                } else {
                    alert("Номер страницы для пагинации должен быть числом")
                }
            }
            if (sorted) {
                url += "&sorted=" + sorted;
            }
            if (url === "?") {
                url = "";
            }
            const result = await api.get(`/venue/show${url}`);
            setData(result);
        };

        return (<>
                <div className="show-table-container">
                    <table border="1" style={{width: "100%", textAlign: "left"}}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Creation By</th>
                            <th>Name</th>
                            <th>Capacity</th>
                            <th>Venue Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (<tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.creationBy}</td>
                            <td>{item.name}</td>
                            <td>{item.capacity}</td>
                            <td>{item.venueType}</td>
                        </tr>))}
                        </tbody>
                    </table>
                    <div className="showBlock">
                        <label>Столбец для фильтрации:
                            <select id="filter-coloumn">
                                <option value="name">Name</option>
                                <option value="capacity">Capacity</option>
                                <option value="venueType">VenueType</option>
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
                            <select id="filter-coloumn">
                                <option value="id">ID</option>
                                <option value="name">Name</option>
                                <option value="capacity">Capacity</option>
                                <option value="venueType">VenueType</option>
                            </select>
                        </label>
                        <br/>
                        <label className="text-field__label" htmlFor="pagination"
                        >Пагинация:
                        </label>
                        <input
                            className="text-field__input ticket"
                            placeholder="pagination"
                            type="text"
                            id="pagination"
                        />
                        <br/>
                        <br/>
                        <button className="showBtn" onClick={fetchPaginationData}>Show</button>
                    </div>
                    <div className="createBlock">
                        <div className="createFields">
                            <label className="text-field__label item" htmlFor="name1"
                            >Name:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="name"
                                type="text"
                                id="name1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="tikcetsCount1"
                            >Capacity:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                id="capacity1"
                            />
                            <br/>
                            <label className="item">VenueType:
                                <select id="venueType1">
                                    <option value="PUB">Pub</option>
                                    <option value="LOFT">Loft</option>
                                    <option value="CINEMA">Cinema</option>
                                </select>
                            </label></div>
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
                            <label className="text-field__label item" htmlFor="name2"
                            >Name:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="name"
                                type="text"
                                id="name2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="capacity2"
                            >Capacity:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                id="capacity2"
                            />
                            <br/>
                            <label className="item">VenueType:
                                <select id="venueType2">
                                    <option value="PUB">Pub</option>
                                    <option value="LOFT">Loft</option>
                                    <option value="CINEMA">Cinema</option>
                                </select>
                            </label>
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
;
export default VenuePage;
