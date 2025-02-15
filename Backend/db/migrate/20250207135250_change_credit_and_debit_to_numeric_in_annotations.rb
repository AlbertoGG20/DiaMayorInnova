class ChangeCreditAndDebitToNumericInAnnotations < ActiveRecord::Migration[7.2]
  def change
    change_column :annotations, :credit, :numeric
    change_column :annotations, :debit, :numeric
  end
end
