class ChangeCreditAndDebitTypeInStudentAnnotations < ActiveRecord::Migration[7.2]
  def change
    change_column :student_annotations, :credit, :numeric, using: 'credit::numeric'
    change_column :student_annotations, :debit,  :numeric, using: 'debit::numeric'
  end
end
