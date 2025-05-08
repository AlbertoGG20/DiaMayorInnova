class AddObservationsToStudentEntries < ActiveRecord::Migration[7.2]
  def change
    add_column :student_entries, :observations, :text
  end
end 