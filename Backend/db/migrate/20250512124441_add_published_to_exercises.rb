class AddPublishedToExercises < ActiveRecord::Migration[7.2]
  def change
    add_column :exercises, :published, :boolean, default: false
  end
end
