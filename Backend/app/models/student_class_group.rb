class StudentClassGroup < ApplicationRecord
  belongs_to :user
  belongs_to :class_group

  validate :user_is_student

  private

  def user_is_student
    errors.add(:user, "debe ser un estudiante") unless user.student?
  end
end
