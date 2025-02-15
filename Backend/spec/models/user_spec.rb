# frozen_string_literal: true

require 'rails_helper'

describe User do
  let(:user) { create(:user, role: 'student') }

  it { expect(user).to be_valid }
  it { expect(user.role).to eq 'student' }

  let(:teacher_user) { create(:user, role: 'teacher') } # Esta forma, y la siguiente son lo mismo, pero en la siguiente pruebo la factory creada antes
  it { expect(teacher_user).to be_valid }
  it { expect(teacher_user.role).to eq 'teacher' }

  let(:teacher_user) { create(:teacher_user) }
  it { expect(teacher_user).to be_valid }
  it { expect(teacher_user.role).to eq 'teacher' }
end

describe "#admin?" do
  let(:admin_user) { create(:admin_user) }
  let(:user_student) { create(:student_user) }

  it "devuelve true si el usuario es admin" do
    expect(admin_user.admin?).to be true
  end

  it "devuelve false si el usuario no es admin" do
    expect(user_student.admin?).to be false
  end
end

describe "#teacher?" do
  let(:teacher_user) { create(:teacher_user) }
  let(:user_student) { create(:student_user) }

  it "devuelve true si el usuario es teacher" do
    expect(teacher_user.teacher?).to be true
  end

  it "devuelve false si el usuario no es teacher" do
    expect(user_student.teacher?).to be false
  end
end

describe "#student?" do
  let(:student_user) { create(:student_user) }
  let(:teacher_user) { create(:teacher_user) }

  it "devuelve true si el usuario es student" do
    expect(student_user.student?).to be true
  end

  it "devuelve false si el usuario no es student" do
    expect(teacher_user.student?).to be false
  end
end

describe "#generate_new_authentication_token" do
  let(:user) { create(:user) }

  it "genera un nuevo token de autenticación" do
    old_token = user.authentication_token
    user.generate_new_authentication_token
    expect(user.authentication_token).not_to eq(old_token)
    expect(user.authentication_token).to be_present
  end
end