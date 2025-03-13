class SchoolCenter < ApplicationRecord
    has_many :users

    validates :school_name, :address, :phone, :email, :website, :province, presence: true
end
