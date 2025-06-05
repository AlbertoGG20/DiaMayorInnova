import { useState } from 'react';
import AddAccount from '../../components/account/AddAccount';
import AccountsList from '../../components/account/ListAccount';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import ButtonBack from '../../components/button-back/ButtonBack';
import './Account.css';

const Accounts = () => {
  const [newAccount, setNewAccount] = useState(false);

  return (
    <>

      <section className='account__page'>
        <div className='account__page--header'>
          <ButtonBack />
          <Breadcrumbs />
        </div>

        <section className='account__addAcc' >
          <AddAccount setNewAccount={setNewAccount} />
        </section>
        <section className='account__listAcc' >
          <AccountsList newAccount={newAccount} />
        </section>
      </section>

    </>
  )
}

export default Accounts