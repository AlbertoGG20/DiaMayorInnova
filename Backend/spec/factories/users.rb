# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "email_#{n}@test.net" }
    password { 12345678 }
    sequence(:name) { |n| "User #{n}" }
    sequence(:first_lastName) { |n| "first_lastName #{n}" }
    sequence(:second_lastName) { |n| "second_lastName #{n}" }
    role { 'student' }
  end

  factory :student_user, parent: :user do
    sequence(:name) { |n| "Student #{n}" }
    role { 'student' }
  end

  factory :teacher_user, parent: :user do
    sequence(:name) { |n| "Teacher #{n}" }
    role { 'teacher' }
  end

  factory :admin_user, parent: :user do
    sequence(:name) { |n| "Admin #{n}" }
    role { 'admin' }
  end
end
