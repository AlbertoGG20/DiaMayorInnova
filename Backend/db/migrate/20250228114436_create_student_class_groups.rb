class CreateStudentClassGroups < ActiveRecord::Migration[7.2]
  def change
    create_table :student_class_groups do |t|
      t.references :user, null: false, foreign_key: true
      t.references :class_group, null: false, foreign_key: true

      t.timestamps
    end
  end
end
