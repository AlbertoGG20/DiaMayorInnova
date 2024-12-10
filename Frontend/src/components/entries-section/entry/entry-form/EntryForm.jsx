import React, { useEffect, useState } from 'react'
import "./EntryForm.css"
import StudentAnnotationServices from '../../../../services/studentAnnotationServices'
import { useEntries } from '../../../../context/entries-page/EntriesContext'

const EntryForm = ({ aptNumber, setTotal, total }) => {
  const initialAnnotation = {
    account_id: 1,
    number: aptNumber,
    account_number: '',
    debit: '',
    credit: '',
    student_entry_id: 1,
  }

  const [currentAnnotation, setCurrentAnnotation] = useState(initialAnnotation);
  const { deleteAnnotationItem } = useEntries();
  const calc = (value) => parseFloat(value) || 0;

  const deleteEntry = (e) => {
    e.preventDefault();
    console.log(aptNumber)
    deleteAnnotationItem(aptNumber);
  };

  /*   const saveEntry = (e) => {
      e.preventDefault();
      StudentAnnotationServices.create(currentAnnotation)
        .then((response) => {
          if (response && response.data) {
            console.log(response.data);
          } else {
            console.error('Empty response or data property is null');
          }
        })
        .catch((e) => {
          console.error('Error:', e);
        });
    }; */


  const entryValue = () => calc(currentAnnotation.debit) - calc(currentAnnotation.credit);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentAnnotation({ ...currentAnnotation, [name]: value });
  };

  useEffect(() => {
    setTotal(prevTotal => prevTotal + entryValue())
  }, [currentAnnotation])



  return (
    <div className='entry_form_wrapper'>
      <p className='entry_apt'>{aptNumber}</p>
      <form action="" className='entry_form'>
        <fieldset className='form_inputs_container'>
          <div className="form_group">
            <input type="number" id='account_number' name='account_number' placeholder='12345' onChange={handleChange} />
          </div>
          <div className="form_group">
            <input type="text" id='accountName' placeholder='Cuenta carne' name='accountName' />
          </div>
          <div className="form_group">
            <input type="number" id='debit' name='debit' placeholder='0' onChange={handleChange} />
          </div>
          <div className="form_group">
            <input type="number" id='credit' name='credit' placeholder='0' onChange={handleChange} />
          </div>
        </fieldset>
        <button className='btn-trash' onClick={deleteEntry}><i className='fi fi-rr-trash'></i></button>
        {/*         <button className='btn-trash' onClick={saveEntry}><i className='fi fi-rr-disk'></i></button>
 */}      </form>
    </div>
  )
}

export default EntryForm