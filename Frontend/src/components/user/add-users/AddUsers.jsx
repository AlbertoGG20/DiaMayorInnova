import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../config';
import SchoolsServices from '../../../services/SchoolsServices';
import userService from '../../../services/userService';
import { FormField } from '../../form/FormField';
import { accessFormFields, personalFormFields } from './formFields';
import { validateUserForm } from './validateUserForm';
import './AddUsers.css';

const defaultInputValues = {
  email: '',
  password: '',
  confirmation_password: '',
  name: '',
  first_lastName: '',
  second_lastName: '',
  featured_image: null,
  role: 'student',
  school_center_id: '',
};

const AddUsers = ({ selectedUser, setSelectedUser, onUserAdded }) => {
  const auth = useAuth();
  const [input, setInput] = useState(defaultInputValues);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [schoolCenters, setSchoolCenters] = useState([]);

  useEffect(() => {
    const fetchSchoolCenters = async () => {
      try {
        const response = await SchoolsServices.getAll();
        setSchoolCenters(response.schools);
      } catch (error) {
        console.error('Error al obtener centros educativos:', error);
      }
    };

    fetchSchoolCenters();
  }, []);

  const schoolOptions = useMemo(() => (
    schoolCenters.map((center) => (
      <option key={center.id} value={center.id}>
        {center.school_name}
      </option>
    ))
  ), [schoolCenters]);

  useEffect(() => {
    if (selectedUser) {
      setInput({
        email: selectedUser.email,
        password: '',
        confirmation_password: '',
        name: selectedUser.name,
        first_lastName: selectedUser.first_lastName || '',
        second_lastName: selectedUser.second_lastName || '',
        featured_image: selectedUser.featured_image?.url
          ? `${API_BASE_URL}${selectedUser.featured_image.url}`
          : null,
        role: selectedUser.role,
        school_center_id: selectedUser.school_center_id || '',
      });
    } else {
      setInput(defaultInputValues);
    }
    setError('');
    setSuccessMessage('');
  }, [selectedUser]);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onImageChange = useCallback((event) => {
    setInput(prev => ({ ...prev, featured_image: event.target.files[0] }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const errorMessage = validateUserForm(input, selectedUser);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append('user[email]', input.email);
    if (input.password) {
      formData.append('user[password]', input.password);
    }
    formData.append('user[name]', input.name);
    formData.append('user[first_lastName]', input.first_lastName);
    formData.append('user[second_lastName]', input.second_lastName);
    if (input.featured_image) {
      formData.append('user[featured_image]', input.featured_image);
    }
    formData.append('user[role]', input.role);
    if (input.school_center_id) {
      formData.append('user[school_center_id]', input.school_center_id);
    }

    try {
      if (selectedUser) {
        const response = await userService.updateUser(selectedUser.id, formData);

        if (response.data?.data?.user) {
          setError('');
          setSuccessMessage('El usuario se ha modificado correctamente.');
          onUserAdded();
        }

        setSelectedUser(null);
      } else {
        const response = await userService.createUser(formData);

        if (response.data?.data?.user) {
          setError('');
          setSuccessMessage('El usuario se ha creado correctamente.');
          onUserAdded();
        }
      }

      setInput(defaultInputValues);
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setSuccessMessage('');
      setError(error.response?.data?.data?.errors.at(0) || 'Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <>
      <section className='create-users_wrapper'>
        <h2>{selectedUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}</h2>
        <form className='create-users_form' onSubmit={handleSubmit}>
          <fieldset className='create-users_fieldset'>
            <legend>Información de acceso</legend>
            {accessFormFields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={input[field.name]}
                onChange={handleInput}
              />
            ))}
          </fieldset>

          <fieldset className='create-users_fieldset'>
            <legend>Información personal</legend>
            {personalFormFields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={input[field.name]}
                onChange={handleInput}
              />
            ))}
          </fieldset>

          <label htmlFor='featured_image' className='user_label'>Introduzca una imagen de usuario
            {input.featured_image && (
              <div>
                <p>Imagen actual:</p>
                <img
                  src={
                    typeof input.featured_image === 'string'
                      ? input.featured_image
                      : URL.createObjectURL(input.featured_image)
                  }
                  alt='Imagen actual del usuario'
                  style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                />
              </div>
            )}
            <input
              type='file'
              id='featured_image'
              name='featured_image'
              className='user_item'
              onChange={onImageChange}
            />
          </label>
          <div className='add-users__selectors-container'>
            <label htmlFor='role' className='user_label--select'>Seleccione un rol
              <select
                id='role'
                name='role'
                className='user_item'
                value={input.role}
                onChange={handleInput}
              >
                {auth?.user?.role === 'admin' ? (
                  <>
                    <option value='admin'>Admin</option>
                    <option value='center_admin'>Center_Admin</option>
                    <option value='teacher'>Teacher</option>
                    <option value='student'>Student</option>
                  </>
                ) : (
                  <>
                    <option value='teacher'>Teacher</option>
                    <option value='student'>Student</option>
                  </>
                )}
              </select>
            </label>

            {auth?.user?.role !== 'center_admin' && (
              <label htmlFor='school_center_id' className='user_label--select'>Centro Escolar
                <select id='school_center_id' name='school_center_id' className='user_item' value={input.school_center_id} onChange={handleInput}>
                  <option value=''>Seleccione un centro</option>
                  {schoolOptions}
                </select>
              </label>
            )}
          </div>
          <button type='submit' className='createSchool_submit btn'><i className='fi fi-rr-plus'></i>{selectedUser ? 'Actualizar Usuario' : 'Registrar Usuario'}</button>
          {selectedUser && <button type='button' className='btn light' onClick={() => setSelectedUser(null)}>Cancelar</button>}
          {error && <p role='alert' className='error-message'>{error}</p>}
          {successMessage && <p role='alert' className='success-message'>{successMessage}</p>}
        </form>
      </section>
    </>
  );
};

export default AddUsers;