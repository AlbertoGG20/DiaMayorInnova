class RenameModuleInClassGroups < ActiveRecord::Migration[7.2]
  def change
    rename_column :class_groups, :module, :course_module
  end
end
