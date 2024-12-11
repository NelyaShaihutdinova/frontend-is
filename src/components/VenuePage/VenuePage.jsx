import {useEffect, useState} from "react";
import {api} from "../api.js";

const VenuePage = () => {
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/show${url}`, {
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
            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        }

        const deleteTicket = async () => {
            let id = document.querySelector("#id3");
            let replaceId = document.querySelector("#id4");
            if (!id.value || isNaN(id.value)) {
                alert("Please enter a id");
                return;
            } else {
                id = parseInt(id.value);
            }
            if (!replaceId.value || isNaN(replaceId.value)) {
                alert("Please enter a id to replace");
                return;
            } else {
                replaceId = parseInt(replaceId.value);
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/delete/${id}?replace=${replaceId}`, {
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/venue/show${url}`, {
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
                            <select id="sorted">
                                <option value="id">ID</option>
                                <option value="name">Name</option>
                                <option value="capacity">Capacity</option>
                                <option value="venueType">VenueType</option>
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
                            <label className="text-field__label item" htmlFor="id4"
                            >Venue ID to replace in Ticket:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                id="id4"
                            />
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
