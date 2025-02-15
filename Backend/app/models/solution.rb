class Solution < ApplicationRecord
  belongs_to :statement
  has_many :entries, dependent: :destroy
  has_many :annotations, through: :entries
  validates :description, presence: true, uniqueness: { scope: :statement_id }

  accepts_nested_attributes_for :entries, allow_destroy: true
end
