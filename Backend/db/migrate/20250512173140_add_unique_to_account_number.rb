class AddUniqueToAccountNumber < ActiveRecord::Migration[7.2]
  def change
    add_index :accounts, :account_number, unique: true
  end
end
