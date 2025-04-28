require 'rails_helper'

RSpec.describe ClassGroupsController, type: :controller do
  let(:school_center) { create(:school_center) }
  let(:admin_user) { create(:user, role: 'admin') }
  let(:center_admin) { create(:user, role: 'center_admin', school_center: school_center) }
  let(:teacher_user) { create(:user, role: 'teacher', school_center: school_center) }
  let(:student_user) { create(:user, role: 'student') }
  
  let(:valid_attributes) do
    {
      course: 1,
      course_module: 'Mathematics',
      modality: 'Online',
      number_students: 10,
      max_students: 30,
      location: 'Room 101',
      weekly_hours: 5,
      school_center_id: school_center.id
    }
  end

  let(:invalid_attributes) { valid_attributes.merge(course: nil) }

  describe "GET #index" do
    context "as administrator" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "returns all groups" do
        create_list(:class_group, 3)
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to eq(3)
      end
    end

    context "as center administrator" do
      before { request.headers['AUTH-TOKEN'] = center_admin.authentication_token }

      it "returns only the groups of its center" do
        create(:class_group, school_center: school_center)
        create(:class_group)
        get :index
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to eq(1)
      end
    end

    context "filtering" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "filter by course module" do
        create(:class_group, course_module: 'Physics')
        get :index, params: { course_module: 'Phys' }
        expect(JSON.parse(response.body).first['course_module']).to eq('Physics')
      end

      it "filter by user ID" do
        cg = create(:class_group)
        create(:teacher_class_group, class_group: cg, user: teacher_user)
        get :index, params: { user_id: teacher_user.id }
        expect(JSON.parse(response.body).first['id']).to eq(cg.id)
      end
    end
  end

  describe "GET #show" do
    let(:class_group) { create(:class_group) }

    context "authorized" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "returns the correct group" do
        get :show, params: { id: class_group.id }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['id']).to eq(class_group.id)
      end
    end

    context "unauthorized" do
      before { request.headers['AUTH-TOKEN'] = student_user.authentication_token }

      it "redirect to login" do
        get :show, params: { id: class_group.id }
        expect(response).to have_http_status(:found)
      end
    end
  end

  describe "POST #create" do
    context "as administrator" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "create a new group" do
        expect {
          post :create, params: { class_group: valid_attributes }
        }.to change(ClassGroup, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "as center administrator" do
      before { request.headers['AUTH-TOKEN'] = center_admin.authentication_token }

      it "automatically assigns the center" do
        post :create, params: { class_group: valid_attributes.except(:school_center_id) }
        expect(JSON.parse(response.body)['school_center_id']).to eq(school_center.id)
      end
    end

    context "with invalid parameters" do
      before { request.headers['AUTH-TOKEN'] = admin_user.authentication_token }

      it "returns validation errors" do
        post :create, params: { class_group: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('course')
      end
    end
  end

  describe "PUT #update" do
    let(:class_group) { create(:class_group, school_center: school_center) }

    context "as assigned teacher" do
      before do
        create(:teacher_class_group, user: teacher_user, class_group: class_group)
        request.headers['AUTH-TOKEN'] = teacher_user.authentication_token 
      end

      it "update the group" do
        put :update, params: { id: class_group.id, class_group: { course_module: 'Updated' } }
        expect(response).to have_http_status(:ok)
        expect(class_group.reload.course_module).to eq('Updated')
      end
    end

    context "unauthorized update" do
      before { request.headers['AUTH-TOKEN'] = teacher_user.authentication_token }

      it "returns unauthorized" do
        put :update, params: { id: class_group.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE #destroy" do
    let!(:class_group) { create(:class_group, school_center: school_center) }

    context "as center administrator" do
      before { request.headers['AUTH-TOKEN'] = center_admin.authentication_token }

      it "deletes the group" do
        expect {
          delete :destroy, params: { id: class_group.id }
        }.to change(ClassGroup, :count).by(-1)
        expect(response).to have_http_status(:ok)
      end
    end

    context "with existing partnerships" do
      before do
        request.headers['AUTH-TOKEN'] = center_admin.authentication_token 
        create(:student_class_group, class_group: class_group)
      end

      it "allows you to remove" do
        delete :destroy, params: { id: class_group.id }
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "POST #update_users" do
    let(:class_group) { create(:class_group, school_center: school_center) }
    let(:students) { create_list(:user, 2, role: 'student') }
    let(:teachers) { create_list(:user, 1, role: 'teacher') }

    before do
      create(:teacher_class_group, user: teacher_user, class_group: class_group)
      request.headers['AUTH-TOKEN'] = teacher_user.authentication_token 
    end

    it "updates students and teachers" do
      post :update_users, params: { 
        id: class_group.id,
        users: students.map(&:id) + teachers.map(&:id) + [teacher_user.id]
      }

      expect(response).to have_http_status(:ok)
      expect(class_group.reload.students.count).to eq(2)
      expect(class_group.teachers.count).to eq(2)
      expect(class_group.number_students).to eq(2)
    end
  end
end