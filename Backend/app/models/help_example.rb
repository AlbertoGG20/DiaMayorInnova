class HelpExample < ApplicationRecord
  belongs_to :account
  belongs_to :solution, optional: true
end
