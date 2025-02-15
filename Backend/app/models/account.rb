class Account < ApplicationRecord
  belongs_to :accounting_plan
  has_many :help_examples, dependent: :destroy
  has_many :annotations, dependent: :destroy
  has_many :student_annotations

  default_scope { order(account_number: :asc) }
end

# A