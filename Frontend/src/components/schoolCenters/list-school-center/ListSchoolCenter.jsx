import React, { useEffect, useState } from 'react';
import SchoolsServices from '../../../services/SchoolsServices';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import "./ListSchoolCenter.css"
import Table from '../../table/Table';
import FindNameSchoolCenter from '../find-name-school-center/FindNameSchoolCenter';
import { SearchBar } from '../../search-bar/SearchBar';
import PaginationMenu from '../../pagination-menu/PaginationMenu';

const ListSchoolCenter = ({ schools, setSchools, setSelectedSchool, searchSchoolName, setSeachSchoolName, isEdited }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const allSchools = async (page, school_name) => {
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
  }, [currentPage, isEdited]);

  const deleteSchool = (schoolId) => {
    SchoolsServices.remove(schoolId)
      .then(() => {
        setSchools(prev => prev.filter(school => school.id !== schoolId));
        setIsModalOpen(false);
      })
      .catch(e => console.log(e));
  };

  const handleDeleteClick = (schoolId) => {
    const school = schools.find(school => school.id === schoolId);
    setSchoolToDelete(school);
    setIsModalOpen(true);
  };

  const handleEditClick = (schoolId) => {
    const school = schools.find(school => school.id === schoolId);
    setSelectedSchool(school);
  };

  return (
    <>
      <section className='school-center-list__container'>
        <h2>Lista de Centros Escolares</h2>
        <SearchBar
          value={searchSchoolName}
          handleSearchChange={setSeachSchoolName}
        />
        <Table
          titles={["Nombre", "Teléfono", "Provincia", "Dirección", "Web", "Acciones"]}
          data={schools}
          actions={true}
          openModal={handleEditClick}
          deleteItem={handleDeleteClick}
          columnConfig={[
            { field: "school_name", sortable: true },
            { field: "phone", sortable: false },
            { field: "province", sortable: true },
            { field: "address", sortable: true },
            { field: "website", sortable: true },
          ]}
        />

        <PaginationMenu
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
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
