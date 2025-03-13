FactoryBot.define do
  factory :student_class_group do
    association :user, factory: :student_user
    association :class_group
  end
end