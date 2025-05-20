class RemoveStudentAnnotationsAccountNumber < ActiveRecord::Migration[7.2]
  def change
    remove_column :student_annotations, :account_number
  end
end
