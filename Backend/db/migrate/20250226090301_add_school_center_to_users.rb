class AddSchoolCenterToUsers < ActiveRecord::Migration[7.2]
  def change
    add_reference :users, :school_center, foreign_key: true, null: true
  end
end
