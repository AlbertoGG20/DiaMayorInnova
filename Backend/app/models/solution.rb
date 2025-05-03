class Solution < ApplicationRecord
  belongs_to :statement
  has_many :entries, dependent: :destroy
  has_many :annotations, through: :entries
  validates :description, presence: true, allow_blank: true, uniqueness: { scope: :statement_id }
  has_one :help_example, dependent: :nullify  
 
  accepts_nested_attributes_for :entries, allow_destroy: true
end
