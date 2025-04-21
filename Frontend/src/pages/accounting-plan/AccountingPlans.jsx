import AddAccountingPlan from "../../components/accounting-plan/AddAccountingPlan";
import AccountingPlansList from "../../components/accounting-plan/ListAccountingPlan";
import "./AccountingPlans.css"
import { useState } from 'react'
import ButtonBack from "../../components/button-back/ButtonBack";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const AccountingPlans = () => {

  const [newPGC, setNewPGC] = useState(false);

  return (
    <>
      <main className="accountingPlan__page">
        <div className="accountingPlan__page--header">
          <ButtonBack />
          <Breadcrumbs />
        </div>
        <section className="accountingPlan__addPGC" >
          <AddAccountingPlan setNewPGC={setNewPGC} />
        </section>
        <section className="accountingPlan__listPGC">
          <AccountingPlansList newPGC={newPGC} />
        </section>
      </main>
    </>
  );
}

export default AccountingPlans;
