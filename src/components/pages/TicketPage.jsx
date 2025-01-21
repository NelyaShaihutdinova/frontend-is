import {useEffect, useRef, useState} from "react";
import {getData, postData, buildUrl, fetchData} from "../utils/fetch.js";
import './TicketPage.css';


const TicketPage = () => {
        const [data, setData] = useState([]);
        const [result, setResult] = useState(null);
        const [currentPage, setCurrentPage] = useState(1);
        const token = localStorage.getItem("token");
        const filterRef = useRef(null);
        const filterColumnRef = useRef(null);
        const sortedRef = useRef(null);
        const nameRef = useRef(null);
        const coordinatesRef = useRef(null);
        const personRef = useRef(null);
        const eventRef = useRef(null);
        const priceRef = useRef(null);
        const discountRef = useRef(null);
        const numberRef = useRef(null);
        const commentRef = useRef(null);
        const venueRef = useRef(null);
        const refundableRef = useRef(null);
        const ticketTypeRef = useRef(null);
        const idRefUpdate = useRef(null);
        const idRefDelete = useRef(null);
        const idRefByEvent = useRef(null);
        const idRefByPerson = useRef(null);
        const byRefundableRef = useRef(null);
        const byVenueRef = useRef(null);
        const byNumberRef = useRef(null);

        const goToPreviousPage = async () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                const updatedData = await fetchData('/ticket/show', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
                setData(updatedData);
            }
        };

        const goToNextPage = async () => {
            setCurrentPage(currentPage + 1);
            const updatedData = await fetchData('/ticket/show', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
            setData(updatedData);
        };

        useEffect(() => {
            fetchPaginationData(currentPage);
        }, []);

        const validateFields = (fields) => {
            const validationMessages = [
                {condition: !fields.name, message: "Please enter a name"},
                {condition: isNaN(fields.price) || fields.price <= 0, message: "Price must be a number more than zero"},
                {
                    condition: isNaN(fields.discount) || fields.discount <= 0 || fields.discount > 100,
                    message: "Discount must be a number more than zero and less than 100",
                },
                {condition: isNaN(fields.number) || fields.number <= 0, message: "Number must be a number more than zero"},
                {condition: !fields.comment, message: "Please enter a comment"},
                {condition: isNaN(fields.coordinates), message: "Coordinates must be a number"},
                {condition: isNaN(fields.person), message: "Person must be a number"},
                {condition: isNaN(fields.venue), message: "Venue must be a number"},
                {condition: isNaN(fields.event), message: "Event must be a number"},
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
            coordinates: parseInt(coordinatesRef.current?.value),
            person: parseInt(personRef.current?.value),
            event: parseInt(eventRef.current?.value),
            price: parseFloat(priceRef.current?.value),
            discount: parseFloat(discountRef.current?.value),
            number: parseInt(numberRef.current?.value),
            comment: commentRef.current?.value,
            venue: parseInt(venueRef.current?.value),
            refundable: refundableRef.current?.value,
            ticketType: ticketTypeRef.current?.value,
        });

        const createTicket = async () => {
            const fields = getFields();
            if (!validateFields(fields)) return;

            const result = await postData(`/ticket/create`, fields);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const updateTicket = async () => {
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

            const url = `/ticket/update/${fields.id}`;
            const result = await postData(url, ticket);

            if (result.ok) {
                fetchPaginationData();
            } else {
                const data = await result.json();
                alert(data.message);
            }
        };

        const deleteTicket = async () => {
            const id = idRefDelete.current?.value;

            if (!id || isNaN(id)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/ticket/delete/${id}`;
            const response = await postData(url);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const byEventTicket = async () => {
            const eventId = idRefByEvent.current?.value;

            if (!eventId || isNaN(eventId)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/ticket/by-event/${eventId}`;
            const response = await postData(url);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const byPersonTicket = async () => {
            const personId = idRefByPerson.current?.value;

            if (!personId || isNaN(personId)) {
                alert("Please enter a valid ID");
                return;
            }
            const url = `/ticket/by-person/${personId}`;
            const response = await postData(url);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const byRefundableTicket = async () => {
            const refundable = byRefundableRef.current.value;
            const url = `/ticket/by-refundable?refundable=${refundable}`;
            const response = await getData(url, token);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const byVenueTicket = async () => {
            const venue = byVenueRef.current?.value;

            if (!venue) {
                alert("Please enter a valid venue");
                return;
            }
            const url = `/ticket/by-venue?venue=${venue}`;
            const response = await getData(url, token);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                fetchPaginationData();
            }
        }

        const byNumberTicket = async () => {
            const number = byNumberRef.current?.value;

            if (!number || isNaN(number)) {
                alert("Please enter a valid number");
                return;
            }
            const url = `/ticket/by-number?number=${number}`;
            const response = await getData(url, token);
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                const result = await response.json();
                setResult(result);
            }
        }

        const fetchPaginationData = async () => {
            const filterColumn = filterColumnRef.current.value;
            const filter = filterRef.current.value;
            const sorted = sortedRef.current.value;
            const url = '/ticket/show';
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
                            <th>Coordinates</th>
                            <th>Person</th>
                            <th>Event</th>
                            <th>Price</th>
                            <th>Ticket Type</th>
                            <th>Discount</th>
                            <th>Number</th>
                            <th>Comment</th>
                            <th>Refundable</th>
                            <th>Venue</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item) => (<tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.creationBy}</td>
                            <td>{item.name}</td>
                            <td>
                                {item.coordinates.id}
                            </td>
                            <td>
                                {item.person.id}
                            </td>
                            <td>
                                {item.event.id}
                            </td>
                            <td>{item.price}</td>
                            <td>{item.ticketType}</td>
                            <td>{item.discount}</td>
                            <td>{item.number}</td>
                            <td>{item.comment}</td>
                            <td>{item.refundable ? "Yes" : "No"}</td>
                            <td>
                                {item.venue.id}
                            </td>
                        </tr>))}
                        </tbody>
                    </table>
                    <div className="block">
                        <label>Столбец для фильтрации:
                            <select id="filter-column" ref={filterColumnRef}>
                                <option value="coordinates">Coordinates</option>
                                <option value="person">Person</option>
                                <option value="event">Event</option>
                                <option value="venue">Venue</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="ticketType">TicketType</option>
                                <option value="discount">Discount</option>
                                <option value="number">Number</option>
                                <option value="comment">Comment</option>
                                <option value="refundable">Refundable</option>
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
                                <option value="coordinates">Coordinates</option>
                                <option value="person">Person</option>
                                <option value="event">Event</option>
                                <option value="venue">Venue</option>
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="ticketType">TicketType</option>
                                <option value="discount">Discount</option>
                                <option value="number">Number</option>
                                <option value="comment">Comment</option>
                                <option value="refundable">Refundable</option>
                            </select>
                        </label>
                        <br/>
                        <div style={{marginTop: "20px", display: "flex", justifyContent: "center"}}>
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="btn"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage}</span>
                            <button
                                onClick={goToNextPage}
                                className="btn"
                            >
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
                            >Coordinates:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="coordinates_id"
                                type="text"
                                ref={coordinatesRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Person:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="person_id"
                                type="text"
                                ref={personRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Event:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="event_id"
                                type="text"
                                ref={eventRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Price:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="price"
                                type="text"
                                ref={priceRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Discount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="discount"
                                type="text"
                                ref={discountRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Number:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="number"
                                type="text"
                                ref={numberRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Comment:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="comment"
                                type="text"
                                ref={commentRef}
                            />
                            <br/>
                            <label className="text-field__label item"
                            >Venue:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="venue_id"
                                type="text"
                                ref={venueRef}
                            />
                            <br/>
                            <label className="item">Refundable:
                                <select ref={refundableRef}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                            <br/>
                            <label className="item">TicketType:
                                <select ref={ticketTypeRef}>
                                    <option value="BUDGETARY">Budgetary</option>
                                    <option value="VIP">VIP</option>
                                    <option value="CHEAP">Cheap</option>
                                    <option value="USUAL">Usual</option>
                                </select>
                            </label></div>
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
                        <br/>
                        <div style={{display: "flex"}}>
                            <button className="btn" onClick={updateTicket}>Update</button>
                            <button className="btn" onClick={createTicket}>Create</button>
                        </div>
                    </div>
                    <div className="block">
                        <div className="deleteFields">
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
                        </div>
                        <br/>
                        <button className="btn" onClick={deleteTicket}>Delete</button>
                    </div>
                    <div className="block specialBlock">
                        <div className="fields specialFields">
                            <label className="text-field__label item"
                            >Number:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="number"
                                type="text"
                                ref={byNumberRef}
                            />
                            <br/>
                            <div id="answer">{result !== null ? (
                                <div id="number-container">Полученное число: {result}</div>
                            ) : (
                                <div></div>
                            )}

                            </div>
                            <br/>
                            <button className="btn" style={{marginTop: "15px"}} onClick={byNumberTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <br/>
                            <br/>
                            <label>Refundable:
                                <select ref={byRefundableRef}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                            <br/>
                            <br/>
                            <button className="btn" style={{marginTop: "15px"}} onClick={byRefundableTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item"
                            >Venue:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="venueName"
                                type="text"
                                ref={byVenueRef}
                            />
                            <br/>
                            <br/>
                            <button className="btn" onClick={byVenueTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item"
                            >Event:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="event_id"
                                type="text"
                                ref={idRefByEvent}
                            />
                            <br/>
                            <br/>
                            <button className="btn" onClick={byEventTicket}>Cancel event</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item"
                            >Person:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="person_id"
                                type="text"
                                ref={idRefByPerson}
                            />
                            <br/>
                            <br/>
                            <button className="btn" onClick={byPersonTicket}>Cancel booking</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
;
export default TicketPage;
