import "./PaginationMenu.css";

const PaginationMenu = ({ currentPage, setCurrentPage, totalPages }) => {
  const noPages = totalPages === 0;

  return (
    <div className="pagination-menu__container">
      <button
        className="pagination-button"
        disabled={currentPage === 1 || noPages}
        onClick={() => setCurrentPage(1)}
      >
        <i className='fi fi-rr-angle-double-small-left' />
      </button>
      <button
        className="pagination-button"
        disabled={currentPage === 1 || noPages}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        <i className='fi fi-rr-angle-small-left' />
      </button>
      <span className="paging-text">
        {noPages ? "Sin páginas" : `Página ${currentPage} de ${totalPages}`}
      </span>
      <button
        className="pagination-button"
        disabled={currentPage === totalPages || noPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        <i className='fi fi-rr-angle-small-right' />
      </button>
      <button
        className="pagination-button"
        disabled={currentPage === totalPages || noPages}
        onClick={() => setCurrentPage(totalPages)}
      >
        <i className='fi fi-rr-angle-double-small-right' />
      </button>
    </div>
  );
};

export default PaginationMenu;