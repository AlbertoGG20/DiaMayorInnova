class CreateSchoolCenters < ActiveRecord::Migration[7.2]
  def change
    create_table :school_centers do |t|
      t.string :school_name
      t.string :address
      t.string :phone
      t.string :email
      t.string :website
      t.string :province
      t.timestamps
    end
  end
end
