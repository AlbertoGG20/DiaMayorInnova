class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  has_one_attached :featured_image

  has_many :statements, dependent: :destroy #Para poder borrar el usuario es necesario borrar sus enunciados y soluciones. Otra posibilidad sería modificar a nullify
  has_many :tasks, through: :exercises
  has_many :exercises, dependent: :destroy
  has_many :teacher_class_groups, dependent: :destroy
  has_many :class_groups, through: :teacher_class_groups
  has_many :student_class_groups, dependent: :destroy
  has_many :class_groups, through: :student_class_groups
  belongs_to :school_center, optional: true

  acts_as_token_authenticatable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name, :first_lastName, :second_lastName, presence: true
  validates :role, presence: true, inclusion: { in: %w[admin center_admin teacher student], message: "%{value} no es un rol válido" }

  def admin?
    role == 'admin'
  end

  def center_admin?
    role == 'center_admin'
  end

  def teacher?
    role == 'teacher'
  end

  def student?
    role == 'student'
  end
  
  def school_admin?
    center_admin? && school_center.present?
  end

  def generate_new_authentication_token
    token = User.generate_unique_secure_token
    update(authentication_token: token)
  end 
end
