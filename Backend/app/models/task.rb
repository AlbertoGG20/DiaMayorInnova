class Task < ApplicationRecord
  has_and_belongs_to_many :statements, join_table: :task_statements
  belongs_to :user, foreign_key: :created_by
  has_many :users, through: :exercises

  scope :orderer_by_closing_date, -> { order(closing_date: :asc) }

  validate :opening_date_is_before_closing_date
  validates :title, :opening_date, :closing_date, presence: true
  validates :additional_information, presence: true, allow_blank: true
  validates :is_exam, inclusion: { in: [true, false] }

  private

  def opening_date_is_before_closing_date
    if opening_date.present? && closing_date.present? && opening_date >= closing_date
      errors.add(:opening_date, "debe ser anterior a la fecha de cierre")
    end
  end
end
