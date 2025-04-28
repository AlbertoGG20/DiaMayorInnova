require "rails_helper"

RSpec.describe SchoolCentersController, type: :controller do
  
  let(:admin_user) { create(:admin_user) }
  let(:regular_user) { create(:student_user) }

  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(admin_user)
  end

  describe "GET #index" do
    before do
      @school1 = create(:school_center, school_name: "Escuela Alpha")
      @school2 = create(:school_center, school_name: "Escuela Beta")
    end

    context "without search parameters" do
      it "returns all school centers" do
        get :index, format: :json
        expect(response).to be_successful
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(2)
      end
    end

    context "with the parameter school_name" do
      it "returns only those centers matching the name" do
        get :index, params: { school_name: "Alpha" }, format: :json
        expect(response).to be_successful
        json_response = JSON.parse(response.body)
        expect(json_response.length).to eq(1)
        expect(json_response.first["school_name"]).to eq("Escuela Alpha")
      end
    end
  end

  describe "GET #show" do
    let(:school) { create(:school_center, school_name: "Escuela Gamma") }

    context "when the record exists" do
      it "returns the requested school" do
        get :show, params: { id: school.id }, format: :json
        expect(response).to be_successful
        json_response = JSON.parse(response.body)
        expect(json_response["school_name"]).to eq("Escuela Gamma")
      end
    end

    context "when the record does not exist" do
      it "throws an ActiveRecord::RecordNotFound exception" do
        expect {
          get :show, params: { id: 9999 }, format: :json
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe "POST #create" do
    let(:valid_attributes) { attributes_for(:school_center) }
    let(:invalid_attributes) { attributes_for(:school_center, school_name: "", address: "", phone: "") }

    context "with valid parameters" do
      it "creates a new school and returns status :created" do
        expect {
          post :create, params: { school_center: valid_attributes }, format: :json
        }.to change(SchoolCenter, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid parameters" do
      it "does not create the school and returns status :unprocessable_entity" do
        expect {
          post :create, params: { school_center: invalid_attributes }, format: :json
        }.not_to change(SchoolCenter, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    let!(:school) { create(:school_center, school_name: "Escuela Delta") }
    let(:update_attributes) { { school_name: "Escuela Actualizada" } }

    context "with valid parameters" do
      it "updates the school center and returns the updated record" do
        put :update, params: { id: school.id, school_center: update_attributes }, format: :json
        school.reload
        expect(school.school_name).to eq("Escuela Actualizada")
        json_response = JSON.parse(response.body)
        expect(json_response["school_name"]).to eq("Escuela Actualizada")
      end
    end
  end

  describe "DELETE #destroy" do
    let!(:school) { create(:school_center, school_name: "Escuela Epsilon") }

    it "eliminates the school center and returns the remaining centers" do
      expect {
        delete :destroy, params: { id: school.id }, format: :json
      }.to change(SchoolCenter, :count).by(-1)
    end
  end
end
