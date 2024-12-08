import {useEffect, useState} from "react";
import {api} from "../api.js";
import './TicketPage.css';


const TicketPage = () => {
        const [data, setData] = useState([]);
        const [result, setResult] = useState(null);

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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/show`, {
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
            let coordinates = document.querySelector("#coordinates1");
            let person = document.querySelector("#person1");
            let event = document.querySelector("#event1");
            let price = document.querySelector("#price1");
            let discount = document.querySelector("#discount1");
            let number = document.querySelector("#number1");
            let comment = document.querySelector("#comment1");
            let venue = document.querySelector("#venue1");
            let refundable = document.getElementById("refundable1");
            let ticketType = document.getElementById("ticketType1");
            if (!name.value) {
                alert("Please enter a name");
                return;
            }
            if (isNaN(price.value) || Number(price.value) <= 0) {
                alert("Price must be a number more than zero");
                return;
            }
            if (!discount.value || isNaN(discount.value) || Number(discount.value) <= 0 || Number(discount.value) > 100) {
                alert("Discount must be a number more than zero and less than 100");
                return;
            }
            if (!number.value || isNaN(number.value) || Number(number.value) <= 0) {
                alert("Number must be a number more than zero");
                return;
            }
            if (!comment.value) {
                alert("Please enter a comment");
                return;
            }

            if (name && coordinates && price && discount && number && comment && person && venue && refundable && ticketType && event) {
                name = name.value;
                coordinates = parseInt(coordinates.value);
                person = parseInt(person.value);
                event = parseInt(event.value);
                price = parseInt(price.value);
                discount = parseInt(discount.value);
                number = parseInt(number.value);
                comment = comment.value;
                venue = parseInt(venue.value);
                refundable = refundable.value;
                ticketType = ticketType.value;
            }

            const ticket = {
                name: name,
                coordinates: coordinates,
                person: person,
                event: event,
                price: price,
                discount: discount,
                number: number,
                comment: comment,
                venue: venue,
                refundable: refundable,
                ticketType: ticketType,
            }

            console.log(ticket);

            const result = await api.post(`/ticket/create`, ticket);
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
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/delete/${id}`, {
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

        const byEventTicket = async () => {
            let id = document.querySelector("#event8");
            if (!id.value || isNaN(id.value)) {
                alert("Please enter a id");
                return;
            } else {
                id = parseInt(id.value);
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/by-event/${id}`, {
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

        const byPersonTicket = async () => {
            let id = document.querySelector("#person9");
            if (!id.value || isNaN(id.value)) {
                alert("Please enter a id");
                return;
            } else {
                id = parseInt(id.value);
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/by-person/${id}`, {
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

        const byRefundableTicket = async () => {
            let refundable = document.getElementById("refundable6").value;
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/by-refundable?refundable=${refundable}`, {
                method: "GET",
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

        const byVenueTicket = async () => {
            let venue = document.querySelector("#venue7");
            if (venue.value) {
                venue = venue.value;
            } else {
                alert("Please enter a venue name");
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/by-venue?venue=${venue}`, {
                method: "GET",
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

        const byNumberTicket = async () => {
            let number = document.querySelector("#number5");
            if (number.value) {
                number = parseInt(number.value);
            } else {
                alert("Please enter a number")
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/by-number?number=${number}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!(response.ok)) {
                const data = await response.json();
                alert(data.message);
            } else {
                const result = await response.json();
                setResult(result);
            }

        }

        const updateTicket = async () => {
            let id = document.querySelector("#id2");
            let name = document.querySelector("#name2");
            let coordinates = document.querySelector("#coordinates2");
            let person = document.querySelector("#person2");
            let event = document.querySelector("#event2");
            let price = document.querySelector("#price2");
            let discount = document.querySelector("#discount2");
            let number = document.querySelector("#number2");
            let comment = document.querySelector("#comment2");
            let venue = document.querySelector("#venue2");
            let refundable = document.getElementById("refundable2");
            let ticketType = document.getElementById("ticketType2");

            if (!name.value) {
                alert("Please enter a name");
                return;
            }
            if (isNaN(price.value) || Number(price.value) <= 0) {
                alert("Price must be a number more than zero");
                return;
            }
            if (!discount.value || isNaN(discount.value) || Number(discount.value) <= 0 || Number(discount.value) > 100) {
                alert("Discount must be a number more than zero and less than 100");
                return;
            }
            if (!number.value || isNaN(number.value) || Number(number.value) <= 0) {
                alert("Number must be a number more than zero");
                return;
            }
            if (!comment.value) {
                alert("Please enter a comment");
                return;
            }
            if (!id.value || isNaN(id.value)) {
                alert("Please enter a name");
                return;
            } else {
                id = parseInt(id.value);
            }

            if (name && coordinates && price && discount && number && comment && person && venue && refundable && ticketType && event) {
                name = name.value;
                coordinates = parseInt(coordinates.value);
                person = parseInt(person.value);
                event = parseInt(event.value);
                price = parseInt(price.value);
                discount = parseInt(discount.value);
                number = parseInt(number.value);
                comment = comment.value;
                venue = parseInt(venue.value);
                refundable = refundable.value;
                ticketType = ticketType.value;
            }

            const ticket = {
                name: name,
                coordinates: coordinates,
                person: person,
                event: event,
                price: price,
                discount: discount,
                number: number,
                comment: comment,
                venue: venue,
                refundable: refundable,
                ticketType: ticketType,
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/ticket/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(ticket),
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
            const result = await api.get(`/ticket/show${url}`);
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
                    <div className="showBlock">
                        <label>Столбец для фильтрации:
                            <select id="filter-coloumn">
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
                            <label className="text-field__label item" htmlFor="coordinates1"
                            >Coordinates:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="coordinates_id"
                                type="text"
                                id="coordinates1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="person1"
                            >Person:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="person_id"
                                type="text"
                                id="person1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="event1"
                            >Event:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="event_id"
                                type="text"
                                id="event1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="price1"
                            >Price:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="price"
                                type="text"
                                id="price1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="discount1"
                            >Discount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="discount"
                                type="text"
                                id="discount1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="number1"
                            >Number:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="number"
                                type="text"
                                id="number1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="comment1"
                            >Comment:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="comment"
                                type="text"
                                id="comment1"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="venue1"
                            >Venue:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="venue_id"
                                type="text"
                                id="venue1"
                            />
                            <br/>
                            <label className="item">Refundable:
                                <select id="refundable1">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                            <br/>
                            <label className="item">TicketType:
                                <select id="ticketType1">
                                    <option value="BUDGETARY">Budgetary</option>
                                    <option value="VIP">VIP</option>
                                    <option value="CHEAP">Cheap</option>
                                    <option value="USUAL">Usual</option>
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
                            <label className="text-field__label item" htmlFor="coordinates2"
                            >Coordinates:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="coordinates_id"
                                type="text"
                                id="coordinates2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="person2"
                            >Person:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="person_id"
                                type="text"
                                id="person2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="event2"
                            >Event:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="event_id"
                                type="text"
                                id="event2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="price2"
                            >Price:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="price"
                                type="text"
                                id="price2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="discount2"
                            >Discount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="discount"
                                type="text"
                                id="discount2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="number2"
                            >Number:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="number"
                                type="text"
                                id="number2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="comment2"
                            >Comment:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="comment"
                                type="text"
                                id="comment2"
                            />
                            <br/>
                            <label className="text-field__label item" htmlFor="venue2"
                            >Venue:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="venue_id"
                                type="text"
                                id="venue2"
                            />
                            <br/>
                            <label className="item">Refundable:
                                <select id="refundable2">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                            <br/>
                            <label className="item">TicketType:
                                <select id="ticketType2">
                                    <option value="BUDGETARY">Budgetary</option>
                                    <option value="VIP">VIP</option>
                                    <option value="CHEAP">Cheap</option>
                                    <option value="USUAL">Usual</option>
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
                        </div>
                        <br/>
                        <button className="showBtn" onClick={deleteTicket}>Delete</button>
                    </div>
                    <div className="specialBlock">
                        <div className="specialFields">
                            <label className="text-field__label item" htmlFor="number5"
                            >Number:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="number"
                                type="text"
                                id="number5"
                            />
                            <br/>
                            <div id="answer">{result !== null ? (
                                <div id="number-container">Полученное число: {result}</div>
                            ) : (
                                <div></div>
                            )}

                            </div>
                            <br/>
                            <button className="showBtn" onClick={byNumberTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <br/>
                            <br/>
                            <label>Refundable:
                                <select id="refundable6">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </label>
                            <br/>
                            <br/>
                            <button className="showBtn" id="refundableBtn" onClick={byRefundableTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item" htmlFor="venue7"
                            >Venue:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="venueName"
                                type="text"
                                id="venue7"
                            />
                            <br/>
                            <br/>
                            <button className="showBtn" onClick={byVenueTicket}>Find</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item" htmlFor="event8"
                            >Event:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="event_id"
                                type="text"
                                id="event8"
                            />
                            <br/>
                            <br/>
                            <button className="showBtn" onClick={byEventTicket}>Cancel event</button>
                        </div>
                        <div className="specialFields">
                            <label className="text-field__label item" htmlFor="person9"
                            >Person:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="person_id"
                                type="text"
                                id="person9"
                            />
                            <br/>
                            <br/>
                            <button className="showBtn" onClick={byPersonTicket}>Cancel booking</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
;
export default TicketPage;
