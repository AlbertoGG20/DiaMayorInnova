class StatementSerializer < ActiveModel::Serializer
  attributes :id, :definition, :user_id, :is_public

  has_many :solutions, serializer: SolutionSerializer
end