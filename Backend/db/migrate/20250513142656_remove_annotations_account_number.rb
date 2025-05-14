class RemoveAnnotationsAccountNumber < ActiveRecord::Migration[7.2]
  def change
    remove_column :annotations, :account_number
  end
end
