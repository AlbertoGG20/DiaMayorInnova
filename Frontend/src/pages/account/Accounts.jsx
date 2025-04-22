import { useNavigate } from "react-router-dom";
import AddAccount from "../../components/account/AddAccount";
import AccountsList from "../../components/account/ListAccount";
import "./Account.css"


import React, { useState } from 'react'
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ButtonBack from "../../components/button-back/ButtonBack";

const Accounts = () => {

  const [newAcc, setNewAcc] = useState(false);
  const navigate = useNavigate();

  return (
    <>

      <section className="account__page">
        <div className="account__page--header">
          <ButtonBack />
          <Breadcrumbs />
        </div>

        <section className="account__addAcc" >
          <AddAccount setNewAcc={setNewAcc} />
        </section>
        <section className="account__listAcc" >
          <AccountsList newAcc={newAcc} />
        </section>
      </section>

    </>
  )
}

export default Accounts