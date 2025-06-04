class AddCodeToSchoolCenters < ActiveRecord::Migration[7.2]
  def change
    add_column :school_centers, :code, :string
    add_index :school_centers, :code, unique: true
    add_index :school_centers, :school_name, unique: true
    add_index :school_centers, :email, unique: true
  end
end
