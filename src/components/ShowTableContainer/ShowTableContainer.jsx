import './ShowTableContainer.css';
import PaginationTable from "../Table/PaginationTable.jsx";
export default function ShowTableContainer() {
    return (
        <>
            <div className="show-table-container">
                <div className="table-container">
                    <PaginationTable/>
                </div>
            </div>
        </>
    )
}