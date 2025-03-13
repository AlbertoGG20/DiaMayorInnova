FactoryBot.define do
  factory :accounting_plan do
    sequence(:id) { |n| n }
    sequence(:name) { |n| "Accounting Plan #{n}" }
    description { "Test Accounting Plan Description" }
    acronym { |n| "T#{n}P" }
  end
end
