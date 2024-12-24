import {useState, useEffect} from 'react';

const ImportPage = () => {
    const [file, setFile] = useState(null);
    const [history, setHistory] = useState([]);

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

    const [currentPage, setCurrentPage] = useState(1);
    const goToPreviousPage = () => {
        console.log(currentPage)
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchHistory(currentPage - 1)
        }
        console.log(currentPage)
    };

    const goToNextPage = () => {
        console.log(currentPage)
        setCurrentPage(currentPage + 1);
        console.log(currentPage)
        fetchHistory(currentPage + 1)
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert('File uploaded successfully');
                fetchPaginationData();
            } else {
                const data = await response.text();
                alert(data);
                fetchPaginationData();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const downloadImport = async () => {
        let id = document.querySelector("#id3");
        if (!id.value || isNaN(id.value)) {
            alert("Please enter a id");
            return;
        } else {
            id = parseInt(id.value);
        }
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/download/${id}`, {
            method: "POST",
            responseType: 'blob',
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!(response.ok)) {
            const data = await response.text();
            alert(data);
        } else {
            const contentDisposition = response.headers.get('Content-Disposition');
            if (!contentDisposition) {
                throw new Error('Content-Disposition header is missing in the response');
            }

            const fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
            const blob = await response.blob();
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        }
    }

    const fetchHistory = async (page) => {
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
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/history${url}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        const updatedData = replaceNullWithZero(await response.json());
        setHistory(updatedData);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

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
        const response = await fetch(`http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/history${url}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        const updatedData = replaceNullWithZero(await response.json());
        setHistory(updatedData);
    };


    return (
        <>
            <div className="show-table-container">
                <table border="1" style={{width: "100%", textAlign: "left"}}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>File Name</th>
                        <th>Username</th>
                        <th>Import Time</th>
                        <th>Number of imported records</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((item) => (<tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.fileName}</td>
                        <td>{item.username}</td>
                        <td>{item.importTime}</td>
                        <td>{item.numberOfImportedRecords}</td>
                        <td>{item.status}</td>
                    </tr>))}
                    </tbody>
                </table>
                <div className="showBlock">
                    <label>Столбец для фильтрации:
                        <select id="filter-coloumn">
                            <option value="fileName">File Name</option>
                            <option value="username">Username</option>
                            <option value="importTime">Import Time</option>
                            <option value="numberOfImportedRecords">Number of imported records</option>
                            <option value="status">Status</option>
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
                            <option value="fileName">File Name</option>
                            <option value="username">Username</option>
                            <option value="importTime">Import Time</option>
                            <option value="numberOfImportedRecords">Number of imported records</option>
                            <option value="status">Status</option>
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

                <div className="deleteBlock">
                    <div>Import File</div>
                    <input type="file" accept=".json" name="dataFile" onChange={handleFileChange}/>
                    <br/>
                    <br/>
                    <button className="showBtn" onClick={handleUpload}>Upload</button>
                </div>
                <div className="deleteBlock">
                    <div className="deleteFields">
                        <label className="text-field__label item" htmlFor="id3"
                        >Import ID:
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
                    <button className="showBtn" onClick={downloadImport}>Download</button>
                </div>
            </div>
        </>
    );
}

export default ImportPage;