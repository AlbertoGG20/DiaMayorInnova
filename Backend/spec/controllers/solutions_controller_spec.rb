# frozen_string_literal: true

require 'rails_helper'

describe SolutionsController do
  let!(:user) { create :user }

  before do
    request.headers['AUTH-TOKEN'] = user.authentication_token
  end

  describe 'GET index' do
    before do
      get :index
    end

    it { expect(response).to have_http_status(:ok) }
  end
end
