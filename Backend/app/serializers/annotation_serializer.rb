class AnnotationSerializer < ActiveModel::Serializer
  attributes :id, :number, :credit, :debit, :account_number, :account_name

  def account_number
    object.account.account_number
  end

  def account_name
    object.account.name
  end
end
