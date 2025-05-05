class AddIsExampleToSolutions < ActiveRecord::Migration[7.0]
    def change
      add_column :solutions, :is_example, :boolean, default: false, null: false
    end
end