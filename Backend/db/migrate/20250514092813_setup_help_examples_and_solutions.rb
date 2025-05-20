class SetupHelpExamplesAndSolutions < ActiveRecord::Migration[7.2]
  def change
    add_column :solutions, :is_example, :boolean, default: false, null: false
    add_reference :help_examples, :solution, null: true, foreign_key: true
  end
end
