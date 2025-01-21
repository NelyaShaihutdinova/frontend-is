import {useState, useEffect, useRef} from 'react';
import {buildUrl, fetchData, getData, postData} from "../utils/fetch.js";

const ImportPage = () => {
    const [file, setFile] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem("token");
    const filterRef = useRef(null);
    const filterColumnRef = useRef(null);
    const sortedRef = useRef(null);
    const idRef = useRef(null);

    const goToPreviousPage = async () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            const updatedData = await fetchData('/import/history', filterColumnRef, filterRef, sortedRef, currentPage - 1, token);
            setHistory(updatedData);
        }
    };

    const goToNextPage = async () => {
        setCurrentPage(currentPage + 1);
        const updatedData = await fetchData('/import/history', filterColumnRef, filterRef, sortedRef, currentPage + 1, token);
        setHistory(updatedData);
    };

    useEffect(() => {
        fetchPaginationData();
    }, []);

    const fetchPaginationData = async () => {
        const filterColumn = filterColumnRef.current.value;
        const filter = filterRef.current.value;
        const sorted = sortedRef.current.value;
        const url = '/import/history';
        const buildedUrl = buildUrl(url, filterColumn, filter, sorted, currentPage);
        const updatedData = await getData(buildedUrl, token);
        setHistory(updatedData);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = `/import/upload`;
            const response = await postData(url, formData);
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
        const id = idRef.current?.value;

        if (!id || isNaN(id)) {
            alert("Please enter a valid ID");
            return;
        }

        const url = `/import/download/${id}`;
        const response = await postData(url);
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
                <div className="block">
                    <label>Столбец для фильтрации:
                        <select ref={filterColumnRef}>
                            <option value="fileName">File Name</option>
                            <option value="username">Username</option>
                            <option value="importTime">Import Time</option>
                            <option value="numberOfImportedRecords">Number of imported records</option>
                            <option value="status">Status</option>
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
                    <div>Import File</div>
                    <input type="file" accept=".json" name="dataFile" onChange={handleFileChange}/>
                    <br/>
                    <br/>
                    <button className="btn" onClick={handleUpload}>Upload</button>
                </div>
                <div className="block">
                    <div className="fields">
                        <label className="text-field__label item"
                        >Import ID:
                        </label>
                        <input
                            className="text-field__input item"
                            placeholder="id"
                            type="text"
                            ref={idRef}
                        />
                        <br/>
                    </div>
                    <br/>
                    <button className="btn" onClick={downloadImport}>Download</button>
                </div>
            </div>
        </>
    );
}

export default ImportPage;