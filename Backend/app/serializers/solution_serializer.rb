class SolutionSerializer < ActiveModel::Serializer
  attributes :id, :description

  has_many :entries, serializer: EntrySerializer

  def annotations
    object.entries.flat_map(&:annotations)
  end
end