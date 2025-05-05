class AddSolutionToHelpExamples < ActiveRecord::Migration[7.2]
    def change
      add_column :help_examples, :solution, :integer
    end
end