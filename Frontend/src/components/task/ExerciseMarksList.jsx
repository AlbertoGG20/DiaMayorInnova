import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getStudentsMarkList, exportMarksToXlsx } from "../../services/exerciseMarksList";
import "./MarkList.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Table from "../table/Table";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

const ExerciseMarksList = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [exerciseMarksList, setExerciseMarksList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const taskId = location.state?.task_id;

    useEffect(() => {
        if (!taskId) return;

        const fetchMarkList = async () => {
            try {
                const response = await getStudentsMarkList(taskId, currentPage, 10);
                setExerciseMarksList(response.data.students);
                setTotalPages(response.data.meta.total_pages);
            } catch (error) {
                console.error("Error devolviendo la lista", error);
            }
        };

        fetchMarkList();
    }, [taskId, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleExportToXlsx = async () => {
        try {
            await exportMarksToXlsx(taskId);
        } catch (error) {
            console.error("Error al exportar las notas:", error);
        }
    };

    const titles = ['Fecha', 'Nombre', '% Correcto', 'Nota', 'Estado', 'Acciones'];

    const handleViewResult = (exerciseId) => {
        navigate(`/notas-estudiantes/${id}/examen/${exerciseId}`);
        console.log("Ver resultado del ejercicio:", exerciseId);
    };

    return (
        <div className="mark_list__page">
            <div className="mark_list__header">
                <button className="btn light" onClick={() => navigate(-1)}>
                    <i className="fi fi-rr-arrow-small-left" />
                </button>
                <h1 className="mark_list__page--title"><Breadcrumbs /></h1>
                <button className="btn light" onClick={handleExportToXlsx}>
                    <i className="fi fi-rr-download" /> Exportar en XLSX
                </button>
            </div>

            {
                exerciseMarksList.length > 0 && (
                    <h2 className="mark_list__page--task">{exerciseMarksList[0].task_tittle}</h2>
                )
            }
            <div className="mask_list_table__container">
                <Table
                    titles={titles}
                    data={exerciseMarksList}
                    show={handleViewResult}
                    columnConfig={[
                        { field: 'date', sortable: true },
                        { field: 'student', sortable: true },
                        {
                            field: 'mark',
                            sortable: true,
                            render: (row) => (
                                <div>
                                    <p>{row.mark * 10}%</p>
                                    <progress value={row.mark * 0.1}></progress>
                                </div>
                            )
                        },
                        {
                            field: 'mark',
                            sortable: true,
                            align: 'right'
                        },
                        {
                            field: 'mark',
                            sortable: true,
                            align: 'right',
                            render: (row) => {
                                const statusClass = row.mark >= 5 ? "status__container green" : "status__container red";
                                const statusIcon = row.mark >= 5 ? "fi fi-rr-check" : "fi fi-rr-x";
                                return (
                                    <div className="statement__state">
                                        <div className={statusClass}>
                                            <i className={statusIcon}></i>
                                        </div>
                                    </div>
                                );
                            }
                        },
                        {
                            field: 'exercise_id',
                            render: (row) => (
                                <button
                                    className="btn__table view-result"
                                    onClick={() => handleViewResult(row.exercise_id)}
                                >
                                    <i className="fi fi-rr-eye"></i>
                                </button>
                            )
                        }
                    ]}
                    actions={false}
                />
            </div>
            <div className="mark-list__pagination">
                <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                    <i className='fi fi-rr-angle-double-small-left' />
                </button>
                <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                    <i className='fi fi-rr-angle-small-left' />
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                    <i className='fi fi-rr-angle-small-right' />
                </button>
                <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                    <i className='fi fi-rr-angle-double-small-right' />
                </button>
            </div>
        </div>
    );
}

export default ExerciseMarksList;