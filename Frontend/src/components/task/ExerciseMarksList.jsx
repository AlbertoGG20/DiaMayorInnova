import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getStudentsMarkList, exportMarksToExcel } from "../../services/exerciseMarksList";
import "./MarkList.css"
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Table from "../table/Table";
import { renderToString } from "react-dom/server";

const ExerciseMarksList = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [exerciseMarksList, setExerciseMarksList] = useState([]);

    DataTable.use(DT);

    const exerciseId = location.state?.exercise_id || id;
    
    const handleExportExcel = async () => {
        try {
            await exportMarksToExcel(exerciseId); // Utiliser exerciseId au lieu de taskId
        } catch (error) {
            console.error("Erreur lors de l'exportation des notes :", error);
        }
    };

    useEffect(() => {
        if (!exerciseId) return;

        const fetchMarkList = async () => {
            try {
                const { data } = await getStudentsMarkList(exerciseId);
                setExerciseMarksList(data);
            } catch (error) {
                console.error("Error devolviendo la lista", error);
            }
        };

        fetchMarkList();
    }, [exerciseId]);

    const columns = [
        { title: 'Fecha', data: 'date', className: 'left-align statement__date--header' },
        { title: 'Nombre', data: 'student', className: 'left-align' },
        {
            title: '% Correcto',
            data: 'mark',
            className: 'left-align',
            render: function (data) {
                return renderToString(
                    <>
                        <p>{data * 10}%</p>
                        <progress value={data * 0.1}></progress>
                    </>
                );
            }
        },
        { title: 'Nota', data: 'mark', className: 'right-align' },
        {
            title: 'Estado',
            data: 'mark',
            className: 'right-align statement__state--header',
            render: function (data, type, row) {
                let statusClass = "status__container";
                let statusIcon = "fi";
                (data >= 5)
                    ? (statusClass = "status__container green", statusIcon = "fi fi fi-rr-check")
                    : (statusClass = "status__container red", statusIcon = "fi fi fi-rr-x");

                return `<div class="statement__state" ><div class="${statusClass}"><i class="${statusIcon}"></i></div ></div >`;
            }
        },
        {
            title: 'Acciones',
            data: 'exercise_id',
            className: 'right-align statement__action--header',
            render: function (data, type, row) {
                return `<button class="btn__table view-result" data-id="${row.exercise_id}"><i class="fi fi-rr-eye"></i></button>`;
            }
        },
    ];

    return (
        <div className="mark_list__page">
            <div className="mark_list__header">
                <button className="btn light " onClick={() => navigate(-1)}>
                    <i className="fi fi-rr-arrow-small-left" />
                </button>
                <h1 className="mark_list__page--title">Notas de los estudiantes</h1>
                <button className="btn light" onClick={handleExportExcel}>
                    <i className="fi fi-rr-download" /> Exporter en Excel
                </button>
            </div>

            {exerciseMarksList.length > 0 && (
                <h2 className="mark_list__page--task">{exerciseMarksList[0].task_tittle}</h2>
            )}
            <div className="mask_list_table__container">
                <Table
                    data={exerciseMarksList}
                    columns={columns}
                    id={id}
                />
            </div>
        </div >
    )
}

export default ExerciseMarksList;

