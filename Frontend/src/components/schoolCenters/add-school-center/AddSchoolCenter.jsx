import React, { useState, useEffect } from 'react'
import SchoolsServices from '../../../services/SchoolsServices';
import "./AddSchoolCenter.css"

const AddSchoolCenter = ({ setSchools, selectedSchool, setSelectedSchool, setHandleEdit }) => {
  const initialSchoolState = {
    school_name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    province: "",
    code: ""
  };

  const [input, setInput] = useState(initialSchoolState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedSchool) {
      setInput({
        school_name: selectedSchool.school_name,
        address: selectedSchool.address,
        phone: selectedSchool.phone,
        email: selectedSchool.email,
        website: selectedSchool.website || "",
        province: selectedSchool.province || "",
        code: selectedSchool.code || "",
      });
    } else {
      setInput(initialSchoolState)
    }
  }, [selectedSchool]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.school_name || !input.address || !input.phone || !input.email || !input.website || !input.province || !input.code) {
      setError("Por favor, complete todos los campos obligatorios");
      return;
    }

    try {
      let response;
      if (selectedSchool) {
        response = await SchoolsServices.update(selectedSchool.id, input);
        setSuccessMessage("Centro escolar actualizado con éxito");
        setSchools((prevSchools) => 
          prevSchools.map(school => 
            school.id === selectedSchool.id ? response : school
          )
        );
      } else {
        response = await SchoolsServices.create(input);
        setSuccessMessage("Centro escolar creado con éxito");
        setSchools((prevSchools) => [...prevSchools, response]);
      }
      setSelectedSchool(null);
      setInput(initialSchoolState);
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err) {
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        if (errorData?.school_name?.includes("has already been taken")) {
          setError("Ya existe un centro con ese nombre");
        } else if (errorData?.email?.includes("has already been taken")) {
          setError("El correo electrónico ya está registrado");
        } else if (errorData?.code?.includes("has already been taken")) {
          setError("Código ya vinculado a otro centro");
        } else {
          const errorMessages = Object.values(errorData).flat();
          setError(errorMessages[0] || "Por favor, verifique que todos los campos sean válidos.");
        }
      } else {
        setError(err.response?.data?.message || "Hubo un problema al procesar la solicitud.");
      }
      console.error("Error en la actualización:", err);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  
  return (
    <>
      <section className="create-schools_wrapper">
        <h2>{selectedSchool ? "Editar Centro Escolar" : "Crear Centro Escolar"}</h2>
        <form className="create-schools_form" onSubmit={handleSubmit}>
          <fieldset className='create-schools_fieldset'>
            <label className='school_label'>Nombre del centro
              <input
                type="text"
                name="school_name"
                id="schoolName_input"
                className="school-center_item"
                value={input.school_name}
                onChange={handleInput}
                placeholder="Nombre del centro" />
            </label>
            <label className='school_label'>Código
              <input
                type="text"
                name="code"
                id="schoolCode_input"
                className="school-center_item"
                value={input.code}
                onChange={handleInput}
                placeholder="Código del centro" />
            </label>
          </fieldset>
          <fieldset className='create-schools_fieldset'>
            <label className='school_label'>Provincia
              <input
                type="text"
                name="province"
                id="schoolProvince_input"
                className="school-center_item"
                placeholder="Provincia "
                value={input.province}
                onChange={handleInput} />
            </label>
          </fieldset>
          <fieldset className='create-schools_fieldset'>
            <label className='school_label'>Dirección del centro
              <input
                type="text"
                name="address"
                id="schoolAddress_input"
                className="school-center_item"
                placeholder="Dirección del centro"
                value={input.address}
                onChange={handleInput} />
            </label>
            <label className='school_label'>Telefono
              <input
                type="tel"
                name="phone"
                id="schoolPhone_input"
                className="school-center_item"
                placeholder="Telefono"
                value={input.phone}
                onChange={handleInput} />
            </label>
          </fieldset>
          <label className='school_label'>Correo del centro
            <input
              type="email"
              name="email"
              id="schoolEmail_input"
              className="school-center_item"
              placeholder="Correo del centro"
              value={input.email}
              onChange={handleInput} />
          </label>
          <label className='school_label'>Web del centro
            <input
              type="text"
              name="website"
              id="schoolWebsite_input"
              className="school-center_item"
              placeholder="Web del centro"
              value={input.website}
              onChange={handleInput} />
          </label>
          <button type="submit" onClick={() => setHandleEdit(true)} className="createSchool_submit btn"><i className='fi fi-rr-plus'></i>{selectedSchool ? "Actualizar Centro" : "Añadir Centro"}</button>
          {selectedSchool && <button type='button' className='btn light' onClick={() => setSelectedSchool(null)}>Cancelar</button>}
          {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
          {successMessage && <p role="alert" style={{ color: "green" }}>{successMessage}</p>}
        </form>

      </section>
    </>
  )
}

export default AddSchoolCenter
