class AssignSchoolCenterToUsers < ActiveRecord::Migration[7.2]
  def change
    def up
      User.where(role: %w[teacher student]).update_all("school_center_id = (random() < 0.5 ? 1 : 2)")
    end
  
    def down
      User.update_all(school_center_id: nil)
    end
  end
end
