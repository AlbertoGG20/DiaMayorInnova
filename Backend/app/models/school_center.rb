class SchoolCenter < ApplicationRecord
    has_many :users, dependent: :destroy
    has_many :class_groups, dependent: :destroy

    validates :school_name, :address, :phone, :email, :website, :province, :code, presence: true
    validates :code, uniqueness: { message: "El código del centro ya está en uso" }
end
