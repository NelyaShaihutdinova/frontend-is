import {useEffect, useState} from "react";
import {api} from "../api.js";

const EventPage = () => {
        const [data, setData] = useState([]);

        const fetchData = async () => {
            console.log(localStorage.getItem("token"))
            const result = await api.get(`/event/show`);
            setData(result);
        };

        useEffect(() => {
            fetchData();
        }, []);

        const createTicket = async () => {
            let name = document.querySelector("#name1");
            let ticketsCount = document.querySelector("#ticketsCount1");
            let eventType = document.getElementById("eventType1");

            if (name && ticketsCount && eventType) {
                name = name.value;
                ticketsCount = parseInt(ticketsCount.value);
                eventType = eventType.value;
            }

            const event = {
                name: name,
                ticketsCount: ticketsCount,
                eventType: eventType,
            }

            const result = await api.post(`/event/create`, event);
            console.log(result)
            if (result.ok) {
                setData(result.json());
            } else {
                alert("Проверьте, что TicketCount число больше нуля!");
            }
        }

        const deleteTicket = async () => {
            let id = document.querySelector("#id3");
            if (id) {
                id = parseInt(id.value);
            }
            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/event/delete/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!(response.ok)) {
                alert("Проверьте, что Event с введённым ID существует и что у Вас есть права на удаление этого билета!");
            } else {
                setData(await response.json());
            }
        }

        const updateTicket = async () => {
            let id = document.querySelector("#id2");
            let name = document.querySelector("#name2");
            let ticketsCount = document.querySelector("#ticketsCount2");
            let eventType = document.getElementById("eventType2");

            if (id && name && ticketsCount && eventType) {
                id = parseInt(id.value);
                name = name.value;
                ticketsCount = parseInt(ticketsCount.value);
                eventType = eventType.value;
            }

            const event = {
                name: name,
                ticketsCount: ticketsCount,
                eventType: eventType,
            }

            const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/event/update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(event),
            });

            if (!(response.ok)) {
                alert("Проверьте, что TicketCount число больше нуля и у Вас есть права на их редактирование!");
            } else {
                setData(await response.json());
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
            const result = await api.get(`/event/show${url}`);
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
                    <div className="showBlock">
                        <label>Столбец для фильтрации:
                            <select id="filter-coloumn">
                                <option value="name">Name</option>
                                <option value="ticketsCount">TicketsCount</option>
                                <option value="eventType">EventType</option>
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
                                <option value="ticketsCount">TicketsCount</option>
                                <option value="eventType">EventType</option>
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
                            >TicketsCount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                id="ticketsCount1"
                            />
                            <br/>
                            <label className="item">EventType:
                                <select id="eventType1">
                                    <option value="OPERA">Opera</option>
                                    <option value="FOOTBALL">Football</option>
                                    <option value="THEATRE_PERFORMANCE">Theatre_performance</option>
                                    <option value="EXPOSITION">Exposition</option>
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
                            <label className="text-field__label item" htmlFor="ticketsCount2"
                            >TicketsCount:
                            </label>
                            <input
                                className="text-field__input item"
                                placeholder="tickets count"
                                type="text"
                                id="ticketsCount2"
                            />
                            <br/>
                            <label className="item">EventType:
                                <select id="eventType2">
                                    <option value="OPERA">Opera</option>
                                    <option value="FOOTBALL">Football</option>
                                    <option value="THEATRE_PERFORMANCE">Theatre_performance</option>
                                    <option value="EXPOSITION">Exposition</option>
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
export default EventPage;
