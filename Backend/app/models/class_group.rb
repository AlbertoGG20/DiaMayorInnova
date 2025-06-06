class ClassGroup < ApplicationRecord
  # has_many :users
  belongs_to :school_center
  has_many :student_class_groups, dependent: :destroy
  has_many :students, through: :student_class_groups, source: :user
  has_many :teacher_class_groups, dependent: :destroy
  has_many :teachers,through: :teacher_class_groups, source: :user

  validates :course, :max_students, :weekly_hours, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :number_students, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :school_center_id, :module_name, :cycle, :group_name, :modality, presence: true
  validate :unique_group_in_center
  validate :number_students_not_exceed_max

  def unique_group_in_center
    if ClassGroup.where(
      course: course,
      cycle: cycle,
      group_name: group_name,
      modality: modality,
      school_center_id: school_center_id
    ).where.not(id: id).exists?
      errors.add(:base, "Ya existe un grupo con el mismo curso, ciclo, modalidad y nombre en este centro escolar")
    end
  end

  def number_students_not_exceed_max
    if number_students.present? && max_students.present? && number_students > max_students
      errors.add(:number_students, "no puede exceder el máximo de estudiantes")
    end
  end
end
