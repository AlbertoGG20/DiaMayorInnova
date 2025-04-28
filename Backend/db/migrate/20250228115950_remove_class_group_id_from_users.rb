class RemoveClassGroupIdFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_column :users, :class_group_id, :bigint
  end
end
