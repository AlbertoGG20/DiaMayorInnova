import DataTable from 'datatables.net-react';
import "./Table.css";

import dt from 'datatables.net-dt';
import dtResponsive from 'datatables.net-responsive';
import dtResponsiveDt from 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// Registrar DataTables y extensiones
DataTable.use(dt);
DataTable.use(dtResponsive);
DataTable.use(dtResponsiveDt);

const Table = ({ data, columns, id, isMarkTable = false }) => {
  const navigate = useNavigate();
  const tableRef = useRef(null);

  const options = {
    responsive: true,
    paging: false,
    searching: true,
    pageLength: 10,
    language: {
      search: '',
      searchPlaceholder: 'Buscar en la tabla...',
      lengthMenu: 'Mostrar _MENU_ registros por página',
      zeroRecords: 'No se encontraron resultados',
      info: '',
      infoEmpty: '',
      infoFiltered: '',
      loadingRecords: 'Cargando...',
      processing: 'Procesando...',
      emptyTable: 'No hay datos disponibles en la tabla',
    }
  };
  console.log(data);

  if (isMarkTable) {
    useEffect(() => {
      const handleClick = (event) => {
        const btn = event.target.closest('.view-result');
        if (btn) {
          const exerciseId = btn.getAttribute('data-id');
          navigate(`/notas-estudiantes/${id}/examen/${exerciseId}`);
        }
      };

      const tableElement = tableRef.current;
      if (tableElement) {
        tableElement.addEventListener('click', handleClick);
      }

      return () => {
        if (tableElement) {
          tableElement.removeEventListener('click', handleClick);
        }
      };
    }, [navigate, id]);
  }

  return (
    <div ref={tableRef}>
      <DataTable
        data={data}
        columns={columns}
        options={options}
        className="display"
      />
    </div>
  );
}

export default Table;
