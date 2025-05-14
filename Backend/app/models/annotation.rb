class Annotation < ApplicationRecord
  belongs_to :entry
  belongs_to :account

  default_scope { order(number: :asc) }

  validates :number, presence: true
  validates :credit, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :debit, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :credit_or_debit_but_not_both

  delegate :account_number, to: :account

  def account_name
    account&.name || "Cuenta desconocida"
  end

  private

  def credit_or_debit_but_not_both
    if credit.to_f > 0 && debit.to_f > 0
      errors.add(:base, "No se puede ingresar un valor en credit y debit al mismo tiempo.")
    end
  end
end
