import React, { useEffect, useRef, useState } from "react";
import SolutionsViewer from "../solution/SolutionsViewer";
import statementService from "../../services/statementService";
import "./TaskPage.css";
import useStatements from "../../hooks/useStatements";
import DataTable from 'datatables.net-react';
import dt from 'datatables.net-dt';
import dtResponsive from 'datatables.net-responsive';
import dtResponsiveDt from 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

DataTable.use(dt);
DataTable.use(dtResponsive);
DataTable.use(dtResponsiveDt);

const StatementsSelection = ({
  selectedStatements,
  handleStatementSelection,
  showCheckboxes = true,
}) => {
  const [currentSolutions, setCurrentSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const { statements, solutions, editMode, handleEditSolutions, currentPage, totalPages, setCurrentPage } = useStatements();
  const tableRef = useRef(null);

  const viewSolutions = (statementId) => {
    if (solutions[statementId]) {
      setCurrentSolutions(solutions[statementId]);
      setSelectedStatementId(statementId);
      setIsModalOpen(true);
    } else {
      setLoading(true);
      statementService.getSolutions(statementId)
        .then(response => {
          setCurrentSolutions(response.data);
          setSelectedStatementId(statementId);
          setIsModalOpen(true);
        })
        .catch(error => {
          console.error("Error al cargar soluciones:", error);

        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const hideSolutions = () => {
    setIsModalOpen(false);
    setCurrentSolutions([]);
  };

  if (!Array.isArray(statements)) {
    return <div>Error: No se recibieron enunciados válidos</div>;
  }

  const columns = [
    { title: "ID", data: "id" },
    { title: "Enunciado", data: "definition" },
    {
      title: "Acciones",
      data: "id",
      render: function (data, type, row) {
        return `
          <div class="task-page__actions">
            ${showCheckboxes ? `
              <label>
                <input type="checkbox" class="statement-checkbox" data-id="${data}" />
                <span class="task-page__button-text">Añadir</span>
              </label>
            ` : ""}
            <button class="task-page__button--view" type="button" data-id="${data}">
              <i class="fi fi-rr-eye interrogation"></i>
            </button>
          </div>
        `;
      }
    }
  ];

  const options = {
    responsive: true,
    paging: true,
    searching: true,
    pageLength: 10,
    language: {
      search: '',
      searchPlaceholder: 'Buscar en la tabla...',
      lengthMenu: 'Mostrar _MENU_ registros por página',
      zeroRecords: 'No se encontraron resultados',
      info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
      infoEmpty: 'No hay registros disponibles',
      infoFiltered: '(filtrado de _MAX_ registros totales)',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      emptyTable: 'No hay datos disponibles en la tabla',
    },
    createdRow: function (row, data) {
      const viewButton = row.querySelector(".task-page__button--view");
      const editButton = row.querySelector(".task-page__button--edit");
      const checkbox = row.querySelector(".statement-checkbox");

      if (viewButton) {
        viewButton.addEventListener("click", () => viewSolutions(data.id));
      }
      if (editButton) {
        editButton.addEventListener("click", () => handleEditSolutions(data.id));
      }
      if (checkbox && showCheckboxes) {
        checkbox.checked = selectedStatements.includes(data.id);
        checkbox.addEventListener("change", () => handleStatementSelection(data));
      } else if (checkbox) {
        checkbox.remove();
      }
    }

  };

  return (
    <section className="task-page__selection">
      <div className="task-page__selection--content">
        {/* <div className="task-page__header-row">
          <h2 className="task-page__header">Enunciados</h2>
          <div className="statements__pagination">
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <i className='fi fi-rr-angle-double-small-left'/>
            </button>
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              <i className='fi fi-rr-angle-small-left'/>
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              <i className='fi fi-rr-angle-small-right'/>
            </button>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <i className='fi fi-rr-angle-double-small-right'/>
            </button>
          </div>
        </div>
        <ul className="task-page__list">
          {statements.map((statement) => (
            <li className="task-page__list-item" key={statement.id}>
              <div className="task-page__statement-container">
                <span className="task-page__statement">{statement.definition}</span>
                <div className="task-page__actions">
                  <button className="task-page__button--edit hidden" type="button" onClick={() => handleEditSolutions(statement.id)}>
                    <i className="fi fi-rr-pencil pencil"></i>
                    <span className="task-page__button-text">{editMode === statement.id ? "Cancelar Edición" : "Editar Soluciones"}</span>
                  </button>
                  {showCheckboxes && (
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStatements.includes(statement.id)}
                        onChange={() => handleStatementSelection(statement)}
                      />
                      <span className="task-page__button-text">Añadir</span>
                    </label>
                  )}
                  <button className="task-page__button--edit" type="button" onClick={() => viewSolutions(statement.id)}>
                    <i className="fi fi-rr-interrogation interrogation"></i>
                    <span className="task-page__button-text">Ver Soluciones</span>
                  </button> */}

        <h2 className="task-page__header">Enunciados</h2>
        <div className="task_table__container">
          <div ref={tableRef}>
            <DataTable
              data={statements}
              columns={columns}
              options={options}
              className="display"
            />
          </div>
        </div>


        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <section className="modal-solutionViewer__container">
                <div className="modal-solutionViewer__statement-content">
                  <div className="modal-solutionViewer__head">
                    <h3 className="modal-solutionViewer__statement-title">Enunciado</h3>
                    <button className="btn light" onClick={hideSolutions}>X</button>
                  </div>
                  <div className="modal-solutionViewer__statement-info">
                    <span>{statements.find(statement => statement.id === selectedStatementId)?.definition}</span>
                  </div>
                </div>
                <SolutionsViewer solutions={currentSolutions} />
              </section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatementsSelection;
