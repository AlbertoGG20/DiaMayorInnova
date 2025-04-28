import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import userService from "../../../services/userService.js";
import SchoolsServices from "../../../services/SchoolsServices.js";
import { API_BASE_URL } from "../../../config.js";
import './AddUsers.css';

const AddUsers = ({ setUsers, selectedUser, setSelectedUser }) => {
  const initialUserState = {
    email: "",
    password: "",
    confirmation_password: "",
    name: "",
    first_lastName: "",
    second_lastName: "",
    featured_image: null,
    role: "student",
    school_center_id: "",
  };

  const [input, setInput] = useState(initialUserState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [schoolCenters, setSchoolCenters] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchSchoolCenters = async () => {
      try {
        const response = await SchoolsServices.getAll();
        setSchoolCenters(response.schools);
      } catch (error) {
        console.error("Error al obtener centros educativos:", error);
      }
    };
    fetchSchoolCenters();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setInput({
        email: selectedUser.email,
        password: "",
        confirmation_password: "",
        name: selectedUser.name,
        first_lastName: selectedUser.first_lastName || "",
        second_lastName: selectedUser.second_lastName || "",
        featured_image: selectedUser.featured_image?.url
          ? `${API_BASE_URL}${selectedUser.featured_image.url}`
          : null,
        role: selectedUser.role,
        school_center_id: selectedUser.school_center_id || "",
      });
    } else {
      setInput(initialUserState);
    }
  }, [selectedUser]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onImageChange = (event) => {
    setInput({ ...input, featured_image: event.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.email || !input.name || !input.first_lastName || !input.second_lastName) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    if (!selectedUser && (!input.password || input.password !== input.confirmation_password)) {
      setError("Las contraseñas no coinciden o están vacías.");
      return;
    }

    if (selectedUser && input.password && input.password !== input.confirmation_password) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const formData = new FormData();
    formData.append("user[email]", input.email);
    if (input.password) {
      formData.append("user[password]", input.password);
    }
    formData.append("user[name]", input.name);
    formData.append("user[first_lastName]", input.first_lastName);
    formData.append("user[second_lastName]", input.second_lastName);
    if (input.featured_image) {
      formData.append("user[featured_image]", input.featured_image);
    }
    formData.append("user[role]", input.role);
    if (input.school_center_id) {
      formData.append("user[school_center_id]", input.school_center_id);
    }
    try {
      if (selectedUser) {
        const response = await userService.updateUser(selectedUser.id, formData);

        if (response.data?.data?.user) {
          setUsers(prev => prev.map(user => user.id === selectedUser.id ? response.data.data.user : user));
          setSuccessMessage("El usuario se ha modificado correctamente.");
        }
        setSelectedUser(null);
      } else {
        const response = await userService.createUser(formData);

        if (response.data?.data?.user) {
          setUsers(prev => [...prev, response.data.data.user]);
          setSuccessMessage("El usuario se ha creado correctamente.");
        }
      }
      setInput(initialUserState);
      setError("");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setError(error.response?.data?.data?.message || "Hubo un error al procesar la solicitud.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <section className="create-users_wrapper">
        <h2>{selectedUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}</h2>
        <form className="create-users_form" onSubmit={handleSubmit}>
          <fieldset className='create-users_fieldset'>
            <legend>Información de acceso</legend>
            <label htmlFor='email' className='user_label'>Correo electrónico
              <input
                type="email"
                id="email"
                name="email"
                className="user_item"
                value={input.email}
                onChange={handleInput}
                placeholder="ejemplo@yahoo.es"

              />
            </label>
            <label htmlFor='password' className='user_label'>Contraseña
              <input
                type="password"
                id="password"
                name="password"
                className="user_item"
                value={input.password}
                onChange={handleInput}
                placeholder="Password"
                required={!selectedUser}
              />
            </label>
            <label htmlFor='confirmation_password' className='user_label'>Confirmar contraseña
              <input
                type="password"
                id="confirmation_password"
                name="confirmation_password"
                className="user_item"
                value={input.confirmation_password}
                onChange={handleInput}
                placeholder="Confirmar Password"
                required={!selectedUser}
              />
            </label>
          </fieldset>
          <fieldset className='create-users_fieldset'>
            <legend>Información personal</legend>
            <label htmlFor='name' className='user_label'>Nombre
              <input
                type="text"
                id="name"
                name="name"
                className="user_item"
                value={input.name}
                onChange={handleInput}
                placeholder="Pedro"

              />
            </label>
            <label htmlFor='first_lastName' className='user_label'>Primer Apellido
              <input
                type="text"
                id="first_lastName"
                name="first_lastName"
                className="user_item"
                value={input.first_lastName}
                onChange={handleInput}
                placeholder="Leon"

              />
            </label>
            <label htmlFor='second_lastName' className='user_label'>Segundo Apellido
              <input
                type="text"
                id="second_lastName"
                name="second_lastName"
                className="user_item"
                value={input.second_lastName}
                onChange={handleInput}
                placeholder="Castillo"

              />
            </label>
          </fieldset>

          {/* <div className="add-users__form--upload">
            <button
              className="btn "
              onClick={onImageChange}
              disabled={!selectedFile}
            > Cargar imagen </button>
            <label htmlFor="fileUpload" className="accountingPlan__file--label btn light">
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                id="fileUpload"
                onChange={onImageChange}
                className="accountingPlan__file--input"
              />
              <i className="fi-rr-upload" />
              <p>Imágen</p>
              <span id="file-name" className="accountingPlan__file--name">
                {fileName}
              </span>
            </label>
          </div> */}

          <label htmlFor='featured_image' className='user_label'>Introduzca una imagen de usuario
            {input.featured_image && (
              <div>
                <p>Imagen actual:</p>
                <img
                  src={
                    typeof input.featured_image === "string"
                      ? input.featured_image
                      : URL.createObjectURL(input.featured_image)
                  }
                  alt="Imagen actual del usuario"
                  style={{ width: "100px", height: "auto", marginBottom: "10px" }}
                />
              </div>
            )}
            <input
              type="file"
              id="featured_image"
              name="featured_image"
              className="user_item"
              onChange={onImageChange}
            />
          </label>
          <label htmlFor='role' className='user_label'>Seleccione un rol
            <select
              id="role"
              name="role"
              className="user_item"
              value={input.role}
              onChange={handleInput}
            >
              {auth?.user?.role === "admin" ? (
                <>
                  <option value="admin">Admin</option>
                  <option value="center_admin">Center_Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </>
              ) : (
                <>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </>
              )}
            </select>
          </label>

          {auth?.user?.role !== "center_admin" && (
            <label htmlFor="school_center_id" className="user_label--select">Centro Escolar
              <select id="school_center_id" name="school_center_id" className="user_item" value={input.school_center_id} onChange={handleInput}>
                <option value="">Seleccione un centro</option>
                {schoolCenters.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.school_name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <button type="submit" className="createSchool_submit btn"><i className='fi fi-rr-plus'></i>{selectedUser ? "Actualizar Usuario" : "Registrar Usuario"}</button>
        {selectedUser && <button type="button" className="btn light" onClick={() => setSelectedUser(null)}>Cancelar</button>}
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
        {successMessage && <p role="alert" style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </section >
    </>
  );
};

export default AddUsers;