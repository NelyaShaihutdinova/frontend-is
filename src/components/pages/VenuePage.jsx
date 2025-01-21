import {useEffect, useRef, useState} from "react";
import {postData, getData, buildUrl, fetchData} from "../utils/fetch.js";

const VenuePage = () => {
        const [data, setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const token = localStorage.getItem("token");
        const filterRef = useRef(null);
        const filterColumnRef = useRef(null);
        const sortedRef = useRef(null);
        const nameRef = useRef(null);
        const capacityRef = useRef(null);
        const venueTypeRef = useRef(null);
        const idRefUpdate = useRef(null);
        const idRefDelete = useRef(null);
        const idRefReplace = useRef(null);

        const goToPreviousPage = async () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                const updatedData = await fetchData('/venue/show', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
                setData(updatedData);
            }
        };

        const goToNextPage = async () => {
            setCurrentPage(currentPage + 1);
            const updatedData = await fetchData('/venue/show', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
            setData(updatedData);
        };

        useEffect(() => {
            fetchPaginationData();
        }, []);

        const validateFields = (fields) => {
            const validationMessages = [
                {condition: !fields.name, message: "Please enter a name"},
                {
                    condition: isNaN(fields.capacity) || fields.capacity <= 0,
                    message: "Capacity must be a number more than zero"
                },
            ];

            for (const {condition, message} of validationMessages) {
                if (condition) {
                    alert(message);
                    return false;
                }
            }

            return true;
        };

        const getFields = () => ({
            name: nameRef.current?.value,
            capacity: parseFloat(capacityRef.current?.value),
            venueType: venueTypeRef.current?.value,
        });

        const createVenue = async () => {
            const fields = getFields();
            if (!validateFields(fields)) return;

            const result = await postData(`/venue/create`, fields);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const updateVenue = async () => {
            const fields = {
                ...getFields(),
                id: parseInt(idRefUpdate.current?.value),
            };

            if (isNaN(fields.id)) {
                alert("Please enter a valid ID");
                return;
            }

            if (!validateFields(fields)) return;
            const {id, ...ticket} = fields;

            const url = `/venue/update/${fields.id}`;
            const result = await postData(url, ticket);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const deleteVenue = async () => {
            const id = idRefDelete.current?.value;
            const replaceId = idRefReplace.current?.value;

            if (!id || isNaN(id) || !replaceId || isNaN(replaceId)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/venue/delete/${id}?replace=${replaceId}`;
            const response = await postData(url);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const fetchPaginationData = async () => {
            const filterColumn = filterColumnRef.current.value;
            const filter = filterRef.current.value;
            const sorted = sortedRef.current.value;
            const url = '/venue/show';
            const buildedUrl = buildUrl(url, filterColumn, filter, sorted, currentPage);
            const updatedData = await getData(buildedUrl, token);
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
                    <div className="block">
                        <label>Столбец для фильтрации:
                            <select ref={filterColumnRef}>
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
                            ref={filterRef}
                        />
                        <br/>
                        <label>Столбец для сортировки:
                            <select ref={sortedRef}>
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
                                className="btn">
                                Previous
                            </button>
                            <span>Page {currentPage}</span>
                            <button
                                onClick={goToNextPage}
                                className="btn">
                                Next
                            </button>
                        </div>
                        <button className="btn" onClick={fetchPaginationData}>Show</button>
                    </div>
                    <div className="block">
                        <div className="fields">
                            <label className="text-field__label item"
                            >Name:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="name"
                                type="text"
                                ref={nameRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Capacity:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                ref={capacityRef}
                            />
                            <br/>
                            <label className="item">VenueType:
                                <select ref={venueTypeRef}>
                                    <option value="PUB">Pub</option>
                                    <option value="LOFT">Loft</option>
                                    <option value="CINEMA">Cinema</option>
                                </select>
                            </label>
                            <label className="text-field__label item"
                            >ID:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                ref={idRefUpdate}
                            />
                            <br/>
                        </div>
                        <br/>
                        <div style={{display: "flex"}}>
                            <button className="btn" onClick={updateVenue}>Update</button>
                            <button className="btn" onClick={createVenue}>Create</button>
                        </div>
                    </div>
                    <div className="block">
                        <div className="fields">
                            <label className="text-field__label item"
                            >ID:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                ref={idRefDelete}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Venue ID to replace in Ticket:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                ref={idRefReplace}
                            />
                        </div>
                        <br/>
                        <button className="btn" onClick={deleteVenue}>Delete</button>
                    </div>
                </div>
            </>
        );
    }
;
export default VenuePage;
