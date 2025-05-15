class RemoveExplanationFromStatements < ActiveRecord::Migration[7.2]
  def change
    remove_column :statements, :explanation, :text
  end
end 