class AddIsPublicToExercises < ActiveRecord::Migration[7.2]
  def change
    add_column :exercises, :is_public, :boolean, default: false
  end
end
