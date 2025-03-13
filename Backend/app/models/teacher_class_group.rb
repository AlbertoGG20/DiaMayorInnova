class TeacherClassGroup < ApplicationRecord
  belongs_to :user
  belongs_to :class_group

  validate :user_is_teacher

  private

  def user_is_teacher
    errors.add(:user, "debe ser un profesor") unless user.teacher?
  end
end
