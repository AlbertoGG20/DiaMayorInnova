FactoryBot.define do
  factory :task do
    title { "Tarea de ejemplo" }
    opening_date { Date.today }
    closing_date { Date.today + 1.week }
    additional_information { "Información adicional de la tarea" }
    is_exam { false }
    created_by { association :user }

    transient do
      statements_count { 0 }
    end

    after(:create) do |task, evaluator|
      create_list(:statement, evaluator.statements_count, tasks: [task]) if evaluator.statements_count.positive?
    end
  end
end