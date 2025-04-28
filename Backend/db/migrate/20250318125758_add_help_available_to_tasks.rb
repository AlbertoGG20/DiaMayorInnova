class AddHelpAvailableToTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :tasks, :help_available, :boolean, default: false
  end
end
