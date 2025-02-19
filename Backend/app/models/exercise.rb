class Exercise < ApplicationRecord
  belongs_to :user
  belongs_to :task
  has_many :marks, dependent: :destroy
  
  validates :started, inclusion: { in: [true, false] }
  
  def total_mark
    marks_count = marks.count
    return 0 if marks_count == 0
    marks.sum(:mark)&.to_f / marks_count || 0
  end


  def time_remaining
    return nil unless task.is_exam

    current_time = Time.current

    if current_time < task.opening_date
      0
    elsif current_time > task.closing_date
      0
    else
      (task.closing_date - current_time).to_i
    end
  end

  accepts_nested_attributes_for :marks, allow_destroy: true
end
 