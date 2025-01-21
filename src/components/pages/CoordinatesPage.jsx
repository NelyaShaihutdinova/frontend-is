import {useEffect, useRef, useState} from "react";
import {postData, getData, buildUrl, fetchData} from "../utils/fetch.js";
import "./CoordinatesPage.css"

const CoordinatesPage = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem("token");
    const filterRef = useRef(null);
    const filterColumnRef = useRef(null);
    const sortedRef = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);
    const idRefUpdate = useRef(null);
    const idRefDelete = useRef(null);
    const idRefReplace = useRef(null);

    const goToPreviousPage = async () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            const updatedData = await fetchData('/coordinates/show', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
            setData(updatedData);
        }
    };

    const goToNextPage = async () => {
        setCurrentPage(currentPage + 1);
        const updatedData = await fetchData('/coordinates/show', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
        setData(updatedData);
    };

    useEffect(() => {
        fetchPaginationData();
    }, []);

    const validateFields = (fields) => {
        const validationMessages = [
            {
                condition: isNaN(fields.x) || fields.x <= 0,
                message: "X must be a number more than zero"
            },
            {
                condition: isNaN(fields.y) || fields.y <= 0,
                message: "Y must be a number more than zero"
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
        x: parseFloat(xRef.current?.value),
        y: parseFloat(yRef.current?.value),
    });

    const createCoordinates = async () => {
        const fields = getFields();
        if (!validateFields(fields)) return;

        const result = await postData(`/coordinates/create`, fields);

        if (result.ok) {
            fetchPaginationData();
        } else {
            const data = await result.json();
            alert(data.message);
        }
    };

    const updateCoordinates = async () => {
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

        const url = `/coordinates/update/${fields.id}`;
        const result = await postData(url, ticket);

        if (result.ok) {
            fetchPaginationData();
        } else {
            const data = await result.json();
            alert(data.message);
        }
    };

    const deleteCoordinates = async () => {
        const id = idRefDelete.current?.value;
        const replaceId = idRefReplace.current?.value;

        if (!id || isNaN(id) || !replaceId || isNaN(replaceId)) {
            alert("Please enter a valid ID");
            return;
        }
        const url = `/coordinates/delete/${id}?replace=${replaceId}`;
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
        const url = '/coordinates/show';
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
                        <th>X</th>
                        <th>Y</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item) => (<tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.creationBy}</td>
                        <td>{item.x}</td>
                        <td>
                            {item.y}
                        </td>
                    </tr>))}
                    </tbody>
                </table>
                <div className="block">
                    <label>Столбец для фильтрации:
                        <select ref={filterColumnRef}>
                            <option value="x">X</option>
                            <option value="y">Y</option>
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
                            <option value="id">ID</option>
                            <option value="x">X</option>
                            <option value="y">Y</option>
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
                        >X:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="x"
                            type="text"
                            ref={xRef}
                        />
                        <br/>
                        <label className="text-field__label item"
                        >Y:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="y"
                            type="text"
                            ref={yRef}
                        />
                        <br/>
                        <label className="text-field__label item"
                        >ID:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="id"
                            type="text"
                            ref={idRefUpdate}
                        />
                    </div>
                    <br/>
                    <div style={{display: "flex"}}>
                        <button className="btn" onClick={updateCoordinates}>Update</button>
                        <button className="btn" onClick={createCoordinates}>Create</button>
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
                        >Coordinates ID to replace in Ticket:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="id"
                            type="text"
                            ref={idRefReplace}
                        />
                    </div>
                    <br/>
                    <button className="btn" onClick={deleteCoordinates}>Delete</button>
                </div>
            </div>
        </>
    );
}

export default CoordinatesPage;