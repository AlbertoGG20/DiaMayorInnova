class AccountingPlan < ApplicationRecord
  has_many :accounts, dependent: :destroy

  validates :name, :acronym, :description, presence: true
end

