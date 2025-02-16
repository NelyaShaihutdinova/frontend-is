import {useEffect, useRef, useState} from "react";
import {postData, getData, buildUrl, fetchData, deleteData} from "../utils/fetch.js";

const PersonPage = () => {
        const [data, setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const token = localStorage.getItem("token");
        const filterRef = useRef(null);
        const filterColumnRef = useRef(null);
        const sortedRef = useRef(null);
        const weightRef = useRef(null);
        const locationRef = useRef(null);
        const eyeColorRef = useRef(null);
        const hairColorRef = useRef(null);
        const idRefUpdate = useRef(null);
        const idRefDelete = useRef(null);
        const idRefReplace = useRef(null);

        const goToPreviousPage = async () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                const updatedData = await fetchData('/person', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
                setData(updatedData);
            }
        };

        const goToNextPage = async () => {
            setCurrentPage(currentPage + 1);
            const updatedData = await fetchData('/person', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
            setData(updatedData);
        };

        useEffect(() => {
            fetchPaginationData();
        }, []);

        const validateFields = (fields) => {
            const validationMessages = [
                {condition: !fields.eyeColor, message: "Please enter a eyeColor"},
                {condition: !fields.hairColor, message: "Please enter a hairColor"},
                {
                    condition: isNaN(fields.weight) || fields.weight <= 0,
                    message: "Weight must be a number more than zero"
                },
                {
                    condition: isNaN(fields.location) || fields.location <= 0,
                    message: "Location must be a number more than zero"
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
            eyeColor: eyeColorRef.current?.value,
            hairColor: hairColorRef.current?.value,
            weight: parseFloat(weightRef.current?.value),
            location: parseFloat(locationRef.current?.value),
        });

        const createPerson = async () => {
            const fields = getFields();
            if (!validateFields(fields)) return;

            const result = await postData(`/person`, fields);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const updatePerson = async () => {
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

            const url = `/person/${fields.id}`;
            const result = await postData(url, ticket);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const deletePerson = async () => {
            const id = idRefDelete.current?.value;
            const replaceId = idRefReplace.current?.value;

            if (!id || isNaN(id) || !replaceId || isNaN(replaceId)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/person/${id}?replace=${replaceId}`;
            const response = await deleteData(url);
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
            const url = '/person';
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
                    <div className="block">
                        <label>Столбец для фильтрации:
                            <select ref={filterColumnRef}>
                                <option value="location">Location</option>
                                <option value="weight">Weight</option>
                                <option value="eyeColor">EyeColor</option>
                                <option value="hairColor">HairColor</option>
                            </select>
                        </label>
                        <br/>
                        <label className="text-field__label"
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
                            >Location:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="location_id"
                                type="text"
                                ref={locationRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Weight:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="weight"
                                type="text"
                                ref={weightRef}
                            />
                            <br/>
                            <label className="item">EyeColor:
                                <select ref={eyeColorRef}>
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
                                </select>
                            </label>
                            <label className="item">HairColor:
                                <select ref={hairColorRef}>
                                    <option value="RED">Red</option>
                                    <option value="YELLOW">Yellow</option>
                                    <option value="WHITE">White</option>
                                    <option value="BROWN">Brown</option>
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
                            <button className="btn" onClick={createPerson}>Create</button>
                            <button className="btn" onClick={updatePerson}>Update</button>
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
                            >Person ID to replace in Ticket:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                ref={idRefReplace}
                            />
                        </div>
                        <br/>
                        <button className="btn" onClick={deletePerson}>Delete</button>
                    </div>
                </div>
            </>
        );
    }
;
export default PersonPage;
