class SchoolCenter < ApplicationRecord
    has_many :users, dependent: :nullify 
    #:destroy si quieres que al eliminar un centro se eliminen los usuarios asociados, nullify permite que queden huérfanos

    validates :school_name, :address, :phone, :email, :website, :province, presence: true
end
