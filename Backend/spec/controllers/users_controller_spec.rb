require "rails_helper"

RSpec.describe UsersController, type: :controller do
  let(:class_group_1) { create(:class_group) }
  let(:class_group_2) { create(:class_group) }
  let(:admin_user) { create(:user, role: 'admin') }
  let(:teacher_user) { create(:user, role: 'teacher') }
  let(:student_user) { create(:user, role: 'student') }
  let(:student_user_2) { create(:user, role: 'student', name: 'Juan',  class_groups_id: class_group_1.id) }
  let(:student_user_3) { create(:user, role: 'student', name: 'Ana', class_groups_id: class_group_2.id) }
  let(:image) { fixture_file_upload(Rails.root.join("spec", "fixtures", "files", "test_image.jpeg"), "image/jpeg") }
  let(:valid_attributes) { { email: 'test@example.com', password: 'password', password_confirmation: 'password', name: 'Test', first_lastName: 'User', second_lastName: 'Resu', role: 'student' } }
  let(:valid_attributes_with_image) { valid_attributes.merge(featured_image: image) }
  let(:invalid_attributes) { { email: '', password: 'password', name: 'Test User' } }
  let(:valid_update_attributes) { { name: 'Updated Name', first_lastName: 'UpdatedLastName' } }
  let(:invalid_update_attributes) { { email: '' } }
  let(:update_attributes_with_image) { { featured_image: image } }

  describe "GET #index" do
    context "cuando el usuario no está autorizado" do
      it "devuelve 401 Unauthorized" do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "cuando el usuario es admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "devuelve la lista de usuarios con 200 OK" do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["data"]["users"]).not_to be_empty
      end
    end

    context "cuando el usuario es teacher" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "devuelve la lista de usuarios con 200 OK" do
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["data"]["users"]).not_to be_empty
      end
    end

    context "cuando se filtra por nombre" do
      before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
        student_user_2
        student_user_3
      end

      it "devuelve solo los usuarios que coinciden con el nombre" do
        get :index, params: { name: "Juan" }
        json_response = JSON.parse(response.body)["data"]["users"]
        expect(json_response.length).to eq(1)
        expect(json_response.first["name"]).to eq("Juan")
      end
    end

    context "cuando se filtra por class_groups_id" do
      before do
        request.headers['AUTH-TOKEN'] = admin_user.authentication_token
        student_user_2
        student_user_3
        student_user_2.save!
        student_user_3.save!
      end

      it "devuelve solo los estudiantes del grupo de clase específico" do
        get :index, params: { class_groups_id: student_user_2.class_groups_id }
        json_response = JSON.parse(response.body)["data"]["users"]
        expect(json_response).to be_an(Array)
        expect(json_response.length).to eq(1)
        expect(json_response.first["class_groups_id"]).to eq(student_user_2.class_groups_id)
      end
    end

    context "cuando el usuario no es admin ni teacher" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }
  
      it "devuelve 401 Unauthorized" do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "cuando los usuarios tienen imágenes adjuntas" do
      let!(:user_with_image) { create(:user, featured_image: image) }
  
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }
  
      it "incluye la URL de la imagen en la respuesta" do
        get :index
        json_response = JSON.parse(response.body)
        
        user_data = json_response["data"]["users"].find { |u| u["id"] == user_with_image.id }
        
        expect(user_data["featured_image"]).not_to be_nil
        expect(user_data["featured_image"]["url"]).to be_present
      end
    end
  end

  describe "GET #show" do
  context "cuando el usuario está autenticado" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "devuelve los datos del usuario correctamente" do
      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["id"]).to eq(student_user.id)
      expect(json_response["email"]).to eq(student_user.email)
    end

    it "devuelve una imagen adjunta si el usuario la tiene" do
      student_user.update(featured_image: image)

      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["featured_image"]).not_to be_nil
      expect(json_response["featured_image"]["url"]).to be_present
    end

    it "devuelve nil si el usuario no tiene imagen" do
      get :show, params: { id: student_user.id }
      json_response = JSON.parse(response.body)["data"]["user"]

      expect(response).to have_http_status(:ok)
      expect(json_response["featured_image"]).to be_nil
    end
  end

  context "cuando el usuario no está autenticado" do
    it "devuelve 401 Unauthorized" do
      get :show, params: { id: student_user.id }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "cuando el usuario no existe" do
    before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

    it "devuelve 404 Not Found" do
      get :show, params: { id: 9999 }
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)["messages"]).to eq("User not found")
    end
  end
end

  describe "POST #create" do
    context "cuando el usuario es admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "crea un nuevo usuario y devuelve success" do
        expect {
          post :create, params: { user: valid_attributes }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:ok)
      end

      it "devuelve un error cuando el usuario no es válido" do
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

    context "cuando el usuario no es admin" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "devuelve unauthorized" do
        post :create, params: { user: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT #update" do
    context "cuando el usuario es admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "actualiza el usuario correctamente y devuelve 200 OK" do
        put :update, params: { id: student_user.id, user: valid_update_attributes }
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)["data"]["user"]
        expect(json_response["name"]).to eq("Updated Name")
        expect(json_response["first_lastName"]).to eq("UpdatedLastName")
      end

      it "devuelve un error cuando los datos son inválidos" do
        put :update, params: { id: student_user.id, user: invalid_update_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)["data"]["errors"]
        expect(json_response).to include("Email can't be blank")
      end

      it "actualiza el usuario con una imagen adjunta" do
        put :update, params: { id: student_user.id, user: update_attributes_with_image }
        expect(response).to have_http_status(:ok)
        user = User.find(student_user.id)
        expect(user.featured_image).to be_attached
      end
    end

    context "cuando el usuario no es admin" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "devuelve 401 Unauthorized" do
        put :update, params: { id: student_user.id, user: valid_update_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "cuando el usuario no existe" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "devuelve 404 Not Found" do
        put :update, params: { id: 9999, user: valid_update_attributes }
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE #destroy" do
    context "cuando el usuario es admin" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "elimina el usuario y devuelve 200 OK" do
        delete :destroy, params: { id: student_user.id }
        expect(response).to have_http_status(:ok)
        expect(User.exists?(student_user.id)).to be_falsey
      end
    end

    context "cuando el usuario no es admin" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "devuelve 401 Unauthorized" do
        delete :destroy, params: { id: student_user.id }
        expect(response).to have_http_status(:unauthorized)
        expect(User.exists?(student_user.id)).to be_truthy
      end
    end

    context "cuando el usuario no existe" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "devuelve 404 Not Found" do
        delete :destroy, params: { id: 9999 }
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end