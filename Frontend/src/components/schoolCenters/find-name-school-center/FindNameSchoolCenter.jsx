import React, { useState } from 'react'
import "./FindNameSchoolCenter.css"

const FindNameSchoolCenter = ({ searchSchoolName, setSeachSchoolName }) => {

  return (
    <section className="search-school_container">
      <h2>Buscar por nombre</h2>
      <div className='search-school_form'>
        <div className='search-bar'>
          <input
            type="text"
            id="searchSchoolName"
            aria-label='Filtrar por nombre de centro'
            name="searchSchoolName"
            className='search-bar_search'
            placeholder='Nombre del centro'
            value={searchSchoolName}
            onChange={(e) => setSeachSchoolName(e.target.value)}
          />
          <i className='fi fi-rr-search' data-testid="fi-fi-rr-search"></i>
        </div>
      </div>
    </section>
  );
};

export default FindNameSchoolCenter;
