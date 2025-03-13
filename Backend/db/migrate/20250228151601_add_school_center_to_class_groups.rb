class AddSchoolCenterToClassGroups < ActiveRecord::Migration[7.2]
  def change
    default_school_center_id = SchoolCenter.first&.id || 1
    add_reference :class_groups, :school_center, foreign_key: true, default: default_school_center_id
    change_column_null :class_groups, :school_center_id, false
  end
end
