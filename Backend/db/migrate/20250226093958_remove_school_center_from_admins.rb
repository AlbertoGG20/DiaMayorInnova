class RemoveSchoolCenterFromAdmins < ActiveRecord::Migration[7.2]
  def change
    def up
      User.where(role: 'admin').update_all(school_center_id: nil)
    end
  
    def down
      raise ActiveRecord::IrreversibleMigration
    end
  end
end
