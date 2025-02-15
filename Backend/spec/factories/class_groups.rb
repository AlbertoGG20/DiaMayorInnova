FactoryBot.define do
  factory :class_group do
    course { 1 }
    sequence(:module) { |n| "Mathematics #{n}" }
    modality { "Online" }
    number_students { 10 }
    max_students { 30 }
    location { "Room 101" }
    weekly_hours { 5 }
  end
end