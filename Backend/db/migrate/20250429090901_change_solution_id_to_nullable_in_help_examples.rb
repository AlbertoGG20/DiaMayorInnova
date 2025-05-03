class ChangeSolutionIdToNullableInHelpExamples < ActiveRecord::Migration[7.0]
  def change
    change_column_null :help_examples, :solution_id, true
  end
end