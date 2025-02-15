FactoryBot.define do
  factory :account do
    sequence(:account_number) { |n| 1000 + n }
    description { "Test Account Description" }
    name { "Test Account Name" }
    association :accounting_plan
  end
end