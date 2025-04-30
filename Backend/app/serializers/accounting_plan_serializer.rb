class AccountingPlanSerializer < ActiveModel::Serializer
    attributes :id, :name, :description, :acronym, :created_at, :updated_at
end