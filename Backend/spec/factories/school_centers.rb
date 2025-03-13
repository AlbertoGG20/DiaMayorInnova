FactoryBot.define do
  factory :school_center do
    sequence(:school_name) { |n| "Escuela #{n}" }
    sequence(:address) { |n| "Calle #{n} - Ciudad" }
    sequence(:phone) { |n| "60012345#{n % 10}" } # Último dígito cambia
    sequence(:email) { |n| "escuela#{n}@correo.com" }
    sequence(:website) { |n| "http://escuela#{n}.com" }
    sequence(:province) { |n| "Provincia #{n}" }

    trait :with_custom_province do
      province { "Provincia Personalizada" }
    end
  end
end