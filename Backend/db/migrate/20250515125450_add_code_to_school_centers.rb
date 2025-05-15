class AddCodeToSchoolCenters < ActiveRecord::Migration[7.2]
  def change
    add_column :school_centers, :code, :string
  end
end
