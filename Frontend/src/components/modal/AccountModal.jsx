import React from "react";
import "../modal/AccountModal.css";

const AccountsModal = ({ isOpen, onClose, accounts }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h3>Cuentas pertenecientes al PGC</h3>

        {accounts.length > 0 ? (
          <table className="modal-table">
            <thead>
              <tr>
                <th>Nº Cuenta</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_number}</td>
                  <td>{account.name}</td>
                  <td>{account.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun compte trouvé pour ce PGC.</p>
        )}
      </div>
    </div>
  );
};

export default AccountsModal;
