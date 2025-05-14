class AddChargeAndCreditToAccounts < ActiveRecord::Migration[7.2]
  def change
    add_column :accounts, :charge, :string
    add_column :accounts, :credit, :string
  end
end
