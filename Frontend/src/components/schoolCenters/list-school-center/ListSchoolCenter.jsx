import React, { useEffect, useState } from 'react';
import SchoolsServices from '../../../services/SchoolsServices';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import "./ListSchoolCenter.css"

const ListSchoolCenter = ({ schools, setSchools, setSelectedSchool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const allSchools = async(page, school_name) => {
    setIsLoading(true);
    try {
      const data = await SchoolsServices.getAll(page, 10, school_name);
      if (data) {
        setSchools(data.schools);
        setTotalPages(data.meta.total_pages)
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    allSchools();
  }, [currentPage]);

  const deleteSchool = (schoolId) => {
    SchoolsServices.remove(schoolId)
      .then(() => {
        setSchools(prev => prev.filter(school => school.id !== schoolId));
        setIsModalOpen(false);
      })
      .catch(e => console.log(e));
  };

  const handleDeleteClick = (school) => {
    setSchoolToDelete(school);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className='school-center-list__container scroll-style'>
        {schools.map(school => (
          <ul className="school-center_list" key={school.id}>
            <li className='school-list_item'>
              <div className="school-list_section">
                <p>{school.school_name}</p>
                <p>{school.phone}</p>
                <p>{school.province}</p>
              </div>
              <div className="school-list_section">
                <p>{school.address}</p>
                <p>{school.website}</p>
              </div>
              <div className="user-list_section">
                <button className="edit-btn btn" onClick={() => setSelectedSchool(school)} >Editar</button>
                <button className="delete-btn btn" onClick={() => handleDeleteClick(school)}>Eliminar</button>
              </div>
            </li>
          </ul>
        ))}

        <div className="school-list__pagination">
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
      </section>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        title="¿Estás seguro de que deseas eliminar este centro?"
        message={`El centro"${schoolToDelete?.school_name}" será eliminado permanentemente.`}
        onDelete={() => deleteSchool(schoolToDelete.id)}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ListSchoolCenter;
