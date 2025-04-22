class Mark < ApplicationRecord
  has_many :student_entries, dependent: :destroy
  belongs_to :exercise
  belongs_to :statement, optional: true
  accepts_nested_attributes_for :student_entries, allow_destroy: true

  default_scope { order(id: :asc) }

  def filtered_student_entries
    student_entries.reject(&:marked_for_destruction?).map do |entry|
      entry.as_json.merge(
        "student_annotations" => entry.student_annotations.reject(&:marked_for_destruction?)
      )
    end
  end
end
