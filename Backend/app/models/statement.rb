class Statement < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :tasks, join_table: :task_statements
  has_many :solutions, dependent: :destroy
  has_many :marks

  accepts_nested_attributes_for :solutions, allow_destroy: true
  validates :definition, presence: true
  validates :explanation, presence: true, allow_blank: true
  validates :is_public, inclusion: { in: [true, false] }
end
