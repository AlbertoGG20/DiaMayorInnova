class AddCommentToMarks < ActiveRecord::Migration[7.2]
  def change
    add_column :marks, :comment, :string, default: ""
  end
end
