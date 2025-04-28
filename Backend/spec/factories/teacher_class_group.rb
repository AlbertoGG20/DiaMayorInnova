FactoryBot.define do
  factory :teacher_class_group do
    association :user, factory: :teacher_user
    association :class_group
  end
end