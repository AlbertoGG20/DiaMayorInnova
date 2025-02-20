class AccountingPlan < ApplicationRecord
  has_many :accounts, dependent: :destroy

  validates :name, presence: true
end
