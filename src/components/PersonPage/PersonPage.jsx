import {useEffect, useState} from "react";
import {api} from "../api.js";

const PersonPage = () => {
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/person/show${url}`, {
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
            let weight = document.querySelector("#weight1");
            let location = document.querySelector("#location1");
            let eyeColor = document.getElementById("eyeColor1");
            let hairColor = document.getElementById("hairColor1");

            if (!location.value) {
                alert("Please enter a location");
                return;
            }
            if (!weight.value || isNaN(weight.value) || Number(weight.value) <= 0) {
                alert("Please enter a weight");
                return;
            }

            if (weight && location && eyeColor && hairColor) {
                weight = parseInt(weight.value);
                location = parseInt(location.value);
                eyeColor = eyeColor.value;
                hairColor = hairColor.value;
            }

            const person = {
                weight: weight,
                location: location,
                eyeColor: eyeColor,
                hairColor: hairColor,
            }

            const result = await api.post(`/person/create`, person);
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/person/delete/${id}?replace=${replaceId}`, {
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
            let weight = document.querySelector("#weight2");
            let location = document.querySelector("#location2");
            let eyeColor = document.getElementById("eyeColor2");
            let hairColor = document.getElementById("hairColor2");

            if (!location.value) {
                alert("Please enter a location");
                return;
            }
            if (!weight.value || isNaN(weight.value)) {
                alert("Please enter a weight");
                return;
            }

            if (weight && location && eyeColor && hairColor && id) {
                id = parseInt(id.value);
                weight = parseInt(weight.value);
                location = parseInt(location.value);
                eyeColor = eyeColor.value;
                hairColor = hairColor.value;
            }

            const person = {
                weight: weight,
                location: location,
                eyeColor: eyeColor,
                hairColor: hairColor,
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/person/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(person),
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/person/show${url}`, {
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
                            <th>Location</th>
                            <th>Weight</th>
                            <th>Eye Color</th>
                            <th>Hair Color</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (<tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.creationBy}</td>
                            <td>
                                {item.location.id}
                            </td>
                            <td>{item.weight}</td>
                            <td>{item.eyeColor}</td>
                            <td>{item.hairColor}</td>
                        </tr>))}
                        </tbody>
                    </table>
                    <div className="showBlock">
                        <label>Столбец для фильтрации:
                            <select id="filter-coloumn">
                                <option value="location">Location</option>
                                <option value="weight">Weight</option>
                                <option value="eyeColor">EyeColor</option>
                                <option value="hairColor">HairColor</option>
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
                                <option value="location">Location</option>
                                <option value="weight">Weight</option>
                                <option value="eyeColor">EyeColor</option>
                                <option value="hairColor">HairColor</option>
                            </select>
                        </label>
                        <br/>
                        <label className="text-field__label" htmlFor="pagination"
                        >Пагинация:
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
                            <label className="text-field__label item" htmlFor="location1"
                            >Location:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="location_id"
                                type="text"
                                id="location1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="weight1"
                            >Weight:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="weight"
                                type="text"
                                id="weight1"
                            />
                            <br/>
                            <label className="item">EyeColor:
                                <select id="eyeColor1">
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
                                </select>
                            </label>
                            <label className="item">HairColor:
                                <select id="hairColor1">
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
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
                            <label className="text-field__label item" htmlFor="location2"
                            >Location:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="location_id"
                                type="text"
                                id="location2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="weight2"
                            >Weight:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="weight"
                                type="text"
                                id="weight2"
                            />
                            <br/>
                            <label className="item">EyeColor:
                                <select id="eyeColor2">
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
                                </select>
                            </label>
                            <label className="item">HairColor:
                                <select id="hairColor2">
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
                                </select>
                            </label></div>
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
                            >Person ID to replace in Ticket:
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
export default PersonPage;
