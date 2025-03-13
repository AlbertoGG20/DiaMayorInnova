require "rails_helper"

RSpec.describe UsersController, type: :controller do
  let(:class_group_1) { create(:class_group) }
  let(:class_group_2) { create(:class_group) }
  let(:admin_user) { create(:user, role: 'admin') }
  let(:teacher_user) { create(:user, role: 'teacher') }
  let(:student_user) { create(:user, role: 'student') }
  let(:student_user_2) { create(:user, role: 'student', name: 'Juan') }
  let(:student_user_3) { create(:user, role: 'student', name: 'Ana') }
  let!(:student_class_group) { create(:student_class_group, user: student_user_2, class_group: class_group_1) }
  let!(:student_class_group_2) { create(:student_class_group, user: student_user_3, class_group: class_group_2) }
  let!(:teacher_class_group) { create(:teacher_class_group, user: teacher_user, class_group: class_group_1) }
  let(:image) { fixture_file_upload(Rails.root.join("spec", "fixtures", "files", "test_image.jpeg"), "image/jpeg") }
  let(:valid_attributes) { { email: 'test@example.com', password: 'password', password_confirmation: 'password', name: 'Test', first_lastName: 'User', second_lastName: 'Resu', role: 'student' } }
  let(:valid_attributes_with_image) { valid_attributes.merge(featured_image: image) }
  let(:invalid_attributes) { { email: '', password: 'password', name: 'Test User' } }
  let(:valid_update_attributes) { { name: 'Updated Name', first_lastName: 'UpdatedLastName' } }
  let(:invalid_update_attributes) { { email: '' } }
  let(:update_attributes_with_image) { { featured_image: image } }

  describe "GET #index" do
  # INDEX NO AUTORIZADOS
    context "when the user is not authorized" do
      it "returns 401 Unauthorized" do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

  # INDEX ADMIN
    context "when the user is admin" do
      let!(:user_with_image) { create(:user, featured_image: image) }
      before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
        student_user_2
        student_user_3
        student_user_2.save!
        student_user_3.save!
      end

      it "returns the list of users with 200 OK" do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["data"]["users"]).not_to be_empty
      end

      describe "filter by name" do
        it "returns only the users matching the name" do
          get :index, params: { name: "Juan" }
          json_response = JSON.parse(response.body)["data"]["users"]
          expect(json_response.length).to eq(1)
          expect(json_response.first["name"]).to eq("Juan")
        end
      end

      describe "when filtering by class_groups_id" do
        it "returns only the students of the specific class group" do
          get :index, params: { class_groups_id: class_group_1.id }
          json_response = JSON.parse(response.body)["data"]["users"]
          expect(json_response).to be_an(Array)
          expect(json_response.length).to eq(1)
          expect(json_response.first["id"]).to eq(student_user_2.id)
        end
      end

      describe "when users have images attached" do
        it "include the URL of the image in the answer" do
          get :index
          json_response = JSON.parse(response.body)
          
          user_data = json_response["data"]["users"].find { |u| u["id"] == user_with_image.id }
          
          expect(user_data["featured_image"]).not_to be_nil
          expect(user_data["featured_image"]["url"]).to be_present
        end
      end
    end

# INDEX TEACHER
    context "when the user is a teacher" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "returns the list of users with 200 OK" do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["data"]["users"]).not_to be_empty
      end
    end

# INDEX STUDENT
    context "when the user is neither admin nor teacher" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }
  
      it "returns 401 Unauthorized" do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  
describe "GET #show" do
# GET AUTENTICADO
  context "when the user is authenticated" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "returns user data correctly" do
      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["id"]).to eq(student_user.id)
      expect(json_response["email"]).to eq(student_user.email)
    end

    it "returns an attached image if the user has one" do
      student_user.update(featured_image: image)

      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["featured_image"]).not_to be_nil
      expect(json_response["featured_image"]["url"]).to be_present
    end

    it "returns nil if the user has no image" do
      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["featured_image"]).to be_nil
    end

    it "returns 404 Not Found" do
      get :show, params: { id: 9999 }
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["messages"]).to eq("User not found")
    end
  end

#GET NO AUTENTICADO
  context "when the user is not authenticated" do
    it "returns 401 Unauthorized" do
      get :show, params: { id: student_user.id }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end



describe "POST #create" do
# POST ADMIN
    context "when the user is admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "creates a new user and returns success" do
        expect {
          post :create, params: { user: valid_attributes }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:ok)
      end

      it "returns an error when the user is not a valid user." do
        post :create, params: { user: invalid_attributes }
        #puts response.body (para mostrar la respuesta real del servidor en la consola)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['data']['errors']).to include("Email can't be blank")
      end

      it "creates a new user with an attached image" do
        expect {
          post :create, params: { user: valid_attributes_with_image }
        }.to change(User, :count).by(1)

        user = User.last
        expect(user.featured_image).to be_attached
        expect(JSON.parse(response.body)["data"]["user"]["featured_image"]).not_to be_nil
      end
    end

# POST TEACHER/STUDENT
    context "when the user is a teacher" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "returns unauthorized" do
        post :create, params: { user: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when the user is a student" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "returns unauthorized" do
        post :create, params: { user: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end


describe "PUT #update" do
# PUT ADMIN
    context "when the user is admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "updates the user correctly and returns 200 OK" do
        put :update, params: { id: student_user.id, user: valid_update_attributes }
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)["data"]["user"]
        expect(json_response["name"]).to eq("Updated Name")
        expect(json_response["first_lastName"]).to eq("UpdatedLastName")
      end

      it "returns an error when data is invalid" do
        put :update, params: { id: student_user.id, user: invalid_update_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)["data"]["errors"]
        expect(json_response).to include("Email can't be blank")
      end

      it "updates the user with an attached image" do
        put :update, params: { id: student_user.id, user: update_attributes_with_image }
        expect(response).to have_http_status(:ok)
        user = User.find(student_user.id)
        expect(user.featured_image).to be_attached
      end

      it "returns 404 Not Found" do
        put :update, params: { id: 9999, user: valid_update_attributes }
        expect(response).to have_http_status(:not_found)
      end
    end

# PUT TEACHER/STUDENT
    context "when the user is not admin" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "returns 401 Unauthorized" do
        put :update, params: { id: student_user.id, user: valid_update_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

describe "DELETE #destroy" do
# DELETE ADMIN
    context "when the user is admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "deletes the user and returns 200 OK" do
        delete :destroy, params: { id: student_user.id }
        expect(response).to have_http_status(:ok)
        expect(User.exists?(student_user.id)).to be_falsey
      end

      it "returns 404 Not Found" do
        delete :destroy, params: { id: 9999 }
        expect(response).to have_http_status(:not_found)
      end
    end

# DELETE TEACHER/STUDENT
    context "when the user is not admin" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "returns 401 Unauthorized" do
        delete :destroy, params: { id: student_user.id }
        expect(response).to have_http_status(:unauthorized)
        expect(User.exists?(student_user.id)).to be_truthy
      end
    end
  end
end