import React, { useState } from 'react';
import SchoolsServices from '../../../services/SchoolsServices';
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import "./ListSchoolCenter.css"

const ListSchoolCenter = ({ schools, setSchools, setSelectedSchool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);

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
