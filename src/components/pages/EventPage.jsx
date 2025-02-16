import {useEffect, useRef, useState} from "react";
import {postData, getData, buildUrl, fetchData, deleteData} from "../utils/fetch.js";

const EventPage = () => {
        const [data, setData] = useState([]);
        const [currentPage, setCurrentPage] = useState(1);
        const token = localStorage.getItem("token");
        const filterRef = useRef(null);
        const filterColumnRef = useRef(null);
        const sortedRef = useRef(null);
        const nameRef = useRef(null);
        const ticketCountRef = useRef(null);
        const eventTypeRef = useRef(null);
        const idRefUpdate = useRef(null);
        const idRefDelete = useRef(null);
        const idRefReplace = useRef(null);

        const goToPreviousPage = async () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                const updatedData = await fetchData('/event', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
                setData(updatedData);
            }
        };

        const goToNextPage = async () => {
            setCurrentPage(currentPage + 1);
            const updatedData = await fetchData('/event', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
            setData(updatedData);
        };

        useEffect(() => {
            fetchPaginationData();
        }, []);

        const validateFields = (fields) => {
            const validationMessages = [
                {condition: !fields.name, message: "Please enter a name"},
                {
                    condition: isNaN(fields.ticketsCount) || fields.ticketsCount <= 0,
                    message: "Ticket count must be a number more than zero"
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
            capacity: parseFloat(ticketCountRef.current?.value),
            venueType: eventTypeRef.current?.value,
        });

        const createEvent = async () => {
            const fields = getFields();
            if (!validateFields(fields)) return;

            const result = await postData(`/event`, fields);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const updateEvent = async () => {
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

            const url = `/event/${fields.id}`;
            const result = await postData(url, ticket);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const deleteEvent = async () => {
            const id = idRefDelete.current?.value;
            const replaceId = idRefReplace.current?.value;

            if (!id || isNaN(id) || !replaceId || isNaN(replaceId)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/event/${id}?replace=${replaceId}`;
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
            const url = '/event';
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
                            <th>Tickets Count</th>
                            <th>Event Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (<tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.creationBy}</td>
                            <td>{item.name}</td>
                            <td>{item.ticketsCount}</td>
                            <td>{item.eventType}</td>
                        </tr>))}
                        </tbody>
                    </table>
                    <div className="block">
                        <label>Столбец для фильтрации:
                            <select ref={filterColumnRef}>
                                <option value="name">Name</option>
                                <option value="ticketsCount">TicketsCount</option>
                                <option value="eventType">EventType</option>
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
                                <option value="name">Name</option>
                                <option value="ticketsCount">TicketsCount</option>
                                <option value="eventType">EventType</option>
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
                            >TicketsCount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                ref={ticketCountRef}
                            />
                            <br/>
                            <label className="item">EventType:
                                <select ref={eventTypeRef}>
                                    <option value="OPERA">Opera</option>
                                    <option value="FOOTBALL">Football</option>
                                    <option value="THEATRE_PERFORMANCE">Theatre_performance</option>
                                    <option value="EXPOSITION">Exposition</option>
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
                        </div>
                        <br/>
                        <div style={{display: "flex"}}>
                            <button className="btn" onClick={updateEvent}>Update</button>
                            <button className="btn" onClick={createEvent}>Create</button>
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
                            >Event ID to replace in Ticket:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="id"
                                type="text"
                                ref={idRefReplace}
                            />
                        </div>
                        <br/>
                        <button className="btn" onClick={deleteEvent}>Delete</button>
                    </div>
                </div>
            </>
        );
    }
;
export default EventPage;
