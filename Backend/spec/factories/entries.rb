FactoryBot.define do
  factory :entry do
    solution { association :solution }

    transient do
      annotations_count { 0 }
    end

    after(:create) do |entry, evaluator|
      create_list(:annotation, evaluator.annotations_count, entry: entry) if evaluator.annotations_count.positive?
    end
  end
end