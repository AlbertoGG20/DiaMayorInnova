import React, { useState, useEffect } from "react";
import SchoolServices from "../../services/SchoolsServices.js";
import ListSchoolCenter from "./list-school-center/ListSchoolCenter.jsx";
import AddSchoolCenter from "./add-school-center/AddSchoolCenter.jsx";
import "./SchoolCenters.css";

const SchoolCenters = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [searchSchoolName, setSeachSchoolName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    SchoolServices.getAll()
      .then((response) => {
        if (response) {
          setSchools(response.schools);
        } else {
          console.error("No se encontraron centros en la respuesta.");
          setError("No se encontraron centros.");
        }
      })
      .catch(e => {
        console.error("Error fetching centros", e);
        setError("Hubo un error al obtener los centros.");
      });
  }, []);

  const filteredCenters = schools.filter(school =>
    school.school_name.toLowerCase().includes(searchSchoolName.toLowerCase())
  );

  return (
    <main className="school-center_page">
      <ListSchoolCenter
        schools={filteredCenters}
        setSchools={setSchools}
        setSelectedSchool={setSelectedSchool}
        searchSchoolName={searchSchoolName}
        setSeachSchoolName={setSeachSchoolName}
      />
      <AddSchoolCenter
        setSchools={setSchools}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
      />
    </main>
  );
};
export default SchoolCenters;