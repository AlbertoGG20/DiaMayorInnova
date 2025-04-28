class RenameClassGroupsIdToClassGroupIdInUsers < ActiveRecord::Migration[7.2]
  def change
    rename_column :users, :class_groups_id, :class_group_id
  end
end
