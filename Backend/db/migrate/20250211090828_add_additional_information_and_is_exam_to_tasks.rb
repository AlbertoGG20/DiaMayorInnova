class AddAdditionalInformationAndIsExamToTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :tasks, :additional_information, :text
    add_column :tasks, :is_exam, :boolean, default: false
  end
end
