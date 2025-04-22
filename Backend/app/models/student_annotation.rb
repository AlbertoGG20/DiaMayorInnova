class StudentAnnotation < ApplicationRecord
  belongs_to :account, optional: true
  belongs_to :student_entry

  before_validation :set_account_number_from_account

  private
  def set_account_number_from_account
    if account_id.present? && account_id_changed?
      self.account_number = account&.account_number
    end
  end
end
