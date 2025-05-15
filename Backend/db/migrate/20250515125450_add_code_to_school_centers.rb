class AddCodeToSchoolCenters < ActiveRecord::Migration[7.2]
  def change
    add_column :school_centers, :code, :string
    add_index :school_centers, :code, unique: true
  end
end
