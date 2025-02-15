FactoryBot.define do
  factory :annotation do
    number { 1 }
    credit { nil }
    debit { nil }
    account { association :account }
    entry { association :entry }

    trait :with_credit do
      credit { 100.0 }
      debit { nil }
    end

    trait :with_debit do
      debit { 100.0 }
      credit { nil }
    end
  end
end