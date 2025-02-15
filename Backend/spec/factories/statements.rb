FactoryBot.define do
  factory :statement do
    definition { "Definición del statement" }
    explanation { "Explicación del statement" }
    is_public { false }
    user { association :user }

    transient do
      tasks_count { 0 }
    end

    after(:create) do |statement, evaluator|
      create_list(:task, evaluator.tasks_count, statements: [statement]) if evaluator.tasks_count.positive?
    end

    transient do
      solutions_count { 0 }
    end

    after(:create) do |statement, evaluator|
      create_list(:solution, evaluator.solutions_count, statement: statement) if evaluator.solutions_count.positive?
    end
  end
end