FactoryBot.define do
  factory :solution do
    description { "Descripción de la solución" }
    statement { association :statement }

    transient do
      entries_count { 0 }
    end

    after(:create) do |solution, evaluator|
      create_list(:entry, evaluator.entries_count, solution: solution) if evaluator.entries_count.positive?
    end
  end
end