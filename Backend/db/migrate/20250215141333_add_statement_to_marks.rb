class AddStatementToMarks < ActiveRecord::Migration[7.2]
  def change
    add_reference :marks, :statement, null: true, foreign_key: true
  end
end
