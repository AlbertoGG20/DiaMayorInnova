class AddFieldsToClassGroups < ActiveRecord::Migration[7.2]
  def change
    add_column :class_groups, :module_name, :string
    add_column :class_groups, :cycle, :string
    add_column :class_groups, :group_name, :string
  end
end
