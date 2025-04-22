import { useNavigate } from "react-router-dom";
import AddAccount from "../../components/account/AddAccount";
import AccountsList from "../../components/account/ListAccount";
import "./Account.css"


import React, { useState } from 'react'

const Accounts = () => {

  const [newAcc, setNewAcc] = useState(false);
  const navigate = useNavigate();

  return (
    <>

      <main className="account__page">
        <div className="account__page--header">
          <button className="btn light account__btnHome" onClick={() => navigate("/home")}>
            <i className="fi-rr-arrow-small-left"/>
          </button>
          <h1 className="account__page--title">Crear Cuenta</h1>
        </div>

        <section className="account__addAcc" >
          <AddAccount setNewAcc={setNewAcc}/>
        </section>
        <section className="account__listAcc" >
          <AccountsList newAcc={newAcc}/>
        </section>
      </main>
      
    </>
  )
}

export default Accounts