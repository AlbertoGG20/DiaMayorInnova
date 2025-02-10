# frozen_string_literal: true

require 'rails_helper'

describe User do
  let(:user) { create(:user, role: 'student') }

  it { expect(user).to be_valid }
  it { expect(user.role).to eq 'student' }
end
