class StudentAnnotation < ApplicationRecord
  belongs_to :account, optional: true
  belongs_to :student_entry

  delegate :account_number, to: :account, allow_nil: true
end
