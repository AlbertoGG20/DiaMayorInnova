class TransferClassGroupDataToStudentClassGroups < ActiveRecord::Migration[7.2]
  class MigrationUser < ActiveRecord::Base
    self.table_name = :users
  end

  def up
    MigrationUser.where.not(class_group_id: nil).find_each do |user|
      StudentClassGroup.create!(
        user_id: user.id,
        class_group_id: user.class_group_id
      )
    end
  end

  def down
    StudentClassGroup.delete_all
  end
end
