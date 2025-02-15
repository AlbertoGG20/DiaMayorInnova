# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

  class_group1 = ClassGroup.create(course: 1, module: "TUM", modality: "Presencial", number_students: 24, max_students: 30, location: "Taller 12", weekly_hours: 6)
  class_group2 = ClassGroup.create(course: 2, module: "PNG", modality: "Distancia", number_students: 12, max_students: 20, location: "Aula 106", weekly_hours: 6)
  accPlanPyme = AccountingPlan.create(name: "PGC para PYMES", description: "El plan más utilizado por el alumnado", acronym: "PGC PYMES")
  accPlan2 = AccountingPlan.create(name: "PGC prueba1", description: "Plan para probar el Crud 1", acronym: "PGC prueba1")
  accPlan3 = AccountingPlan.create(name: "PGC prueba2", description: "Plan para probar el Crud 2", acronym: "PGC prueba2")
  school1 = SchoolCenter.create(school_name: "El rincon",address: "calle de prueba 1",phone: "123456789",email: "elrincon@ies.elrincon.es",website: "www.ieselrincon.es",province: "Las Palmas")
  school1 = SchoolCenter.create(school_name: "IES Siete Palmas",address: "calle de siete palmas 1",phone: "987654321",email: "sietePalmas@ies.elrincon.es",website: "www.sietePalmas.es",province: "Las Palmas")

  # Usuario Admin
  user = User.find_or_create_by(email: 'admin@admin.es') do |u|
    u.name = "Admin"
    u.first_lastName = "Admin"
    u.second_lastName = "Admin"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'admin'
  end
puts "Usuario admin creado: #{user.email} con rol #{user.role}"

  # Usuarios con rol Teacher
  user2 = User.find_or_create_by(email: 'tiburcio@ieselrincon.es') do |u|
    u.name = "Tiburcio"
    u.first_lastName = "Cruz"
    u.second_lastName = "Ravelo"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'teacher'
  end
puts "Usuario admin creado: #{user2.email} con rol #{user2.role}"

  user3 = User.find_or_create_by(email: 'miguel@ieselrincon.es') do |u|
    u.name = "Miguel Ángel"
    u.first_lastName = "Figueroa"
    u.second_lastName = "García"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'teacher'
  end
puts "Usuario admin creado: #{user3.email} con rol #{user3.role}"

user7 = User.find_or_create_by(email: 'nira@ieselrincon.es') do |u|
  u.name = "Nira"
  u.first_lastName = "Ruíz"
  u.second_lastName = "Díaz"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'teacher'
end
puts "Usuario admin creado: #{user7.email} con rol #{user7.role}"

user8 = User.find_or_create_by(email: 'mirian@ieselrincon.es') do |u|
  u.name = "Mirian de la Peña"
  u.first_lastName = "Cabrera"
  u.second_lastName = "Reyes"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'teacher'
end
puts "Usuario admin creado: #{user8.email} con rol #{user8.role}"

 # Usuarios con rol Student
  user4 = User.find_or_create_by(email: 'echedey@ieselrincon.es') do |u|
    u.name = "Echedey"
    u.first_lastName = "Henríquez"
    u.second_lastName = "Hernández"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.class_groups_id = 2
  end
puts "Usuario admin creado: #{user4.email} con rol #{user4.role}"

  user5 = User.find_or_create_by(email: 'mayer@ieselrincon.es') do |u|
    u.name = "Mayer Alberto"
    u.first_lastName = "Guerrero"
    u.second_lastName = "Gutierrez"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.class_groups_id = 1
  end
puts "Usuario admin creado: #{user5.email} con rol #{user5.role}"

  user6 = User.find_or_create_by(email: 'juancarlos@ieselrincon.es') do |u|
    u.name = "Juan Carlos"
    u.first_lastName = "Bolaños"
    u.second_lastName = "Ojeda"
    u.password = 'elrincon'
    u.password_confirmation = 'elrincon'
    u.role = 'student'
    u.class_groups_id = 2
  end
puts "Usuario admin creado: #{user6.email} con rol #{user6.role}"

user9 = User.find_or_create_by(email: 'diago@ieselrincon.es') do |u|
  u.name = "Diago"
  u.first_lastName = "Tall"
  u.second_lastName = "Alioune"
  u.password = 'elrincon'
  u.password_confirmation = 'elrincon'
  u.role = 'student'
  u.class_groups_id = 1
end
puts "Usuario admin creado: #{user9.email} con rol #{user9.role}"

  
  task1 = Task.create(title: "Tarea 1 - Ficticia S.L.", opening_date: DateTime.new(2024, 11, 27 ,04, 00, 0), closing_date: DateTime.new(2024, 12, 1, 23, 59, 0), created_by: 2)
  task2 = Task.create(title: "Tarea 2 - Inventada S.L.", opening_date: DateTime.new(2024, 11, 12,05, 00, 0), closing_date: DateTime.new(2024, 12, 1, 23, 59, 0), created_by: 2)

  statement1 = Statement.create(definition: "Compramos mercaderías a 30 días por 1250€. El proveedor nos incluye en factura un descuento comercial del 2%. Además, la compra tiene unos gastos de transporte de 100€", explanation: "Explicación 1", user: user2, is_public: false)
  statement2 = Statement.create(definition: "Vendemos mercaderías por valor de 3000€. Para el cobro giramos una letra de cambio a 30 días, que es aceptada.", explanation: "Explicación 2", user: user2, is_public: false)
  statement3 = Statement.create(definition: "Devolvemos mercaderías por valor de 200€  al proveedor, por estar inservibles.", explanation: "Explicación 3", user: user2, is_public: false)
  statement4 = Statement.create(definition: "El proveedor nos hace un descuento del 20% en la mercancía que está un poco defectuosa. Se paga al proveedor mediante transferencia.", explanation: "Explicación 4", user: user2, is_public: false)
  statement5 = Statement.create(definition: "Descontamos la letra de cambio en la entidad bancaria, la cual nos cobra una comisión de 30€ y unos intereses de 80€.", explanation: "Explicación 5", user: user2, is_public: true)
  statement6 = Statement.create(definition: "Se devenga la nómina de uno de nuestros trabajadores. El importe íntegro es de 2000€. La cuota empresarial a la Seguridad Social asciende a 700€. La cuota de la SS del trabajador sería de 30€. La retención de IRPF sería de 350€. Pasada 1 semana se paga mediante trasferencia bancaria.", explanation: "Explicación 6", user: user2, is_public: false)

  task1.statements << statement1
  task1.statements << statement2
  task1.statements << statement3

  task2.statements << statement4
  task2.statements << statement5
  task2.statements << statement6
  task2.statements << statement2

  solution1= Solution.create(description: "Descripcion solución 1 de prueba", statement: statement1)
  solution2= Solution.create(description: "Descripcion solución 2 de prueba", statement: statement2)
  solution3= Solution.create(description: "Descripcion solución 3 de prueba", statement: statement3)
  solution4= Solution.create(description: "Descripcion solución 4 de prueba", statement: statement4)
  solution5= Solution.create(description: "Descripcion solución 5 de prueba", statement: statement5)
  solution6= Solution.create(description: "Descripcion solución 6 de prueba", statement: statement6)

  entry1= Entry.create(solution:solution1, entry_number: 1, entry_date: Date.new(2024,11,25))
  entry2= Entry.create(solution:solution2, entry_number: 2, entry_date: Date.new(2024,11,26))

  account1 = Account.create(account_number: 1234, description: "Cuenta de prueba número 1", accounting_plan: accPlanPyme, name: "Cuenta 1")
  account2 = Account.create(account_number: 6543, description: "Cuenta de prueba número 2", accounting_plan: accPlan2, name: "Cuenta 2")
  account3 = Account.create(account_number: 2711, description: "Cuenta de prueba número 3", accounting_plan: accPlan3, name: "Cuenta 3")

  annotation1 = Annotation.create(entry: entry1, account: account1, number: 1, debit: 0 , credit: 100)
  annotation2 = Annotation.create(entry: entry1, account: account2, number: 2, debit: 100 , credit: 0)
  annotation3 = Annotation.create(entry: entry2, account: account3, number: 1, debit: 0 , credit: 300)
  annotation4 = Annotation.create(entry: entry2, account: account2, number: 2, debit: 300 , credit: 0)

  helpExample1 = HelpExample.create(creditMoves: "1 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", debitMoves: "1 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", account: account1, description: "Descripcion ejemplo 1")
  helpExample2 = HelpExample.create(creditMoves: "2 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", debitMoves: "2 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", account: account2, description: "Descripcion ejemplo 2")
  helpExample3 = HelpExample.create(creditMoves: "3 Movimientos Haber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", debitMoves: "3 Movimientos Deber - Texto de ejemplo para probar el seed de Ayudas para las diferentes cuentas", account: account3, description: "Descripcion ejemplo 3")

  exercise1 = Exercise.create(user: user, task: task1) 
  exercise2 = Exercise.create(user: user2, task: task1) 
  exercise3 = Exercise.create(user: user5, task: task2) 
  
  mark1 = Mark.create(mark: 5.5, exercise: exercise1) 
  mark2 = Mark.create(mark: 9, exercise: exercise2) 
  mark3 = Mark.create(mark: 7.5, exercise: exercise3) 

  student_entry1 = StudentEntry.create(entry_number: 1, entry_date: Date.new(2024, 11, 25), mark: mark1) 
  student_entry2 = StudentEntry.create(entry_number: 2, entry_date: Date.new(2024, 11, 25), mark: mark2) 
  student_entry3 = StudentEntry.create(entry_number: 3, entry_date: Date.new(2024, 11, 25), mark: mark3) 
  student_entry3 = StudentEntry.create(entry_number: 2, entry_date: Date.new(2022, 10, 25), mark: mark1) 

  student_annotation1 = StudentAnnotation.create(number: 1, account_number: 1234, credit: 100, debit: 0, student_entry: student_entry1, account: account1) 
  student_annotation2 = StudentAnnotation.create(number: 2, account_number: 1334, credit: 0, debit: 1000, student_entry: student_entry2, account: account2) 
  student_annotation3 = StudentAnnotation.create(number: 3, account_number: 2234, credit: 100, debit: 0, student_entry: student_entry3, account: account3)
  
  teacher_class_group1 = TeacherClassGroup.create(user_id: 2, class_group_id: 1)
  teacher_class_group2 = TeacherClassGroup.create(user_id: 2, class_group_id: 2)
  teacher_class_group3 = TeacherClassGroup.create(user_id: 3, class_group_id: 1)
  teacher_class_group4 = TeacherClassGroup.create(user_id: 3, class_group_id: 2)

  taskExample1 = Task.create(title: "Contabiliza en el libro diario las operaciones que la empresa GAMONAL SL realiza durante el año 20X4", opening_date: DateTime.new(2024, 10, 8,05, 00, 0), closing_date: DateTime.new(2024, 12, 1, 23, 59, 0), created_by: 2)

  statementExample1 = Statement.create(definition: "01/08 Hace un pedido a un proveedor de 200 unidades del producto ROJO a 15 € la unidad. El proveedor nos solicita un anticipo por lo que le transferimos por banco 1.284 €.", explanation: "", user: user2, is_public: false)
  statementExample2 = Statement.create(definition: "03/08 Llega el pedido anterior junto con la factura en la que se incluye un descuento comercial de 2%,además de 200 envases SIN facultad de devolución a 0,25 € la unidad. En las condiciones comerciales se indica que el pago se realizará a final de mes.", explanation: "Aplica el anticipo", user: user2, is_public: false)
  statementExample3 = Statement.create(definition: "07/08 Tras revisar la compra anterior se observa que 25 unidades están inservibles por lo que se las devuelve al proveedor junto con los envases correspondientes.", explanation: "", user: user2, is_public: false)
  statementExample4 = Statement.create(definition: "16/08 Acuerda con el proveedor no esperar a final de mes y procede al pago de la deuda pendiente por lo que le concede un descuento de 150 € y le transfiere por banco el resto.", explanation: "", user: user2, is_public: false)
  statementExample5 = Statement.create(definition: "19/08 D. Luis Mendoza, abogado que se ha dado de alta en el año 20X3, le remite una factura por los servicios prestados por importe de 450 € + IGIC que le abona mediante transferencia bancaria.", explanation: "", user: user2, is_public: false)
  statementExample6 = Statement.create(definition: "21/08 Uno de los empleados solicita un anticipo de la nómina de 600 € que se le paga en efectivo.", explanation: "", user: user2, is_public: false)
  statementExample7 = Statement.create(definition: "31/08 El desglose de la nómina del mes de agosto es el siguiente: Sueldos y salarios: 7.500 €, seguridad social a cargo empresa: 1.875 €, seguridad social de los trabajadores 375 €; retenciones: 975 €. La nómina se paga los días 5 de cada mes.", explanation: "", user: user2, is_public: false)
  statementExample8 = Statement.create(definition: "El 1/09 firma un contrato de leasing de dos años de duración para la adquisición de un vehículo. La empresa no tiene dudas de que va a ejercer la opción de compra. El pago de las cuotas es prepagable y periodicidad cuatrimestral. El tipo de interés de la operación es del 3% cuatrimestral. El valor actual del bien 32.503,15 € coincide con su valor razonable. El cuadro del leasing es el siguiente:", explanation: "", user: user2, is_public: false)
  statementExample9 = Statement.create(definition: "01/09 y el pago de la primera cuota del leasing.", explanation: "", user: user2, is_public: false)
  statementExample10 = Statement.create(definition: "05/09 Paga por transferencia bancaria la nómina de los trabajadores correspondiente al mes de agosto.", explanation: "", user: user2, is_public: false)
  statementExample11 = Statement.create(definition: "16/09 Vende mercaderías por importe de 7.900 €. En la factura se incluyen envases con facultad de devolución por importe de 100 €. Operación a crédito de 45 días.", explanation: "", user: user2, is_public: false)
  statementExample12 = Statement.create(definition: "21/09 Vende en 18.000 € + IGIC una furgoneta que adquirió el 1 de julio del año 20X3 por importe de 26.000 € y un valor residual de 1.000 €. La venía amortizando aplicando el coeficiente lineal máximo que para el 20X3 y 20X4 es del 16%. Cobra la mitad al contado y la otra mitad mediante un efecto aceptado.", explanation: "Contabiliza la amortización del 20X3 y la del 20X4 antes de la venta y la venta.", user: user2, is_public: false)
  statementExample13 = Statement.create(definition: "25/09 Llega la factura del suministro eléctrico del mes en curso por importe de 120 € + IGIC. El recibo está domiciliado en el banco y se paga a principios de mes.", explanation: "", user: user2, is_public: false)
  statementExample14 = Statement.create(definition: "28/09 La nómina del mes de septiembre es igual a la de agosto. Paga a los empleados el mismo día por transferencia bancaria.", explanation: "", user: user2, is_public: false)
  statementExample15 = Statement.create(definition: "29/09 Paga por banco la seguridad social del mes de agosto.", explanation: "", user: user2, is_public: false)
  statementExample16 = Statement.create(definition: "30/09 Contabiliza la liquidación del IGIC correspondiente al tercer trimestre del año en curso.", explanation: "", user: user2, is_public: false)

  taskExample1.statements << statementExample1
  taskExample1.statements << statementExample2
  taskExample1.statements << statementExample3
  taskExample1.statements << statementExample4
  taskExample1.statements << statementExample5
  taskExample1.statements << statementExample6
  taskExample1.statements << statementExample7
  taskExample1.statements << statementExample8
  taskExample1.statements << statementExample9
  taskExample1.statements << statementExample10
  taskExample1.statements << statementExample11
  taskExample1.statements << statementExample12
  taskExample1.statements << statementExample13
  taskExample1.statements << statementExample14
  taskExample1.statements << statementExample15
  taskExample1.statements << statementExample16

  solutionExample1= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample1)
  solutionExample2= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample2)
  solutionExample3= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample3)
  solutionExample4= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample4)
  solutionExample5= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample5)
  solutionExample6= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample6)
  solutionExample7= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample7)
  solutionExample8= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample8)
  solutionExample9= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample9)
  solutionExample10= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample10)
  solutionExample11= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample11)
  solutionExample12= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample12)
  solutionExample13= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample13)
  solutionExample14= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample14)
  solutionExample15= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample15)
  solutionExample16= Solution.create(description: "Primera solución para la tarea con las cuentas principales", statement: statementExample16)


  entryExample1= Entry.create(solution:solutionExample1, entry_number: 1, entry_date: Date.new(2024,8,1)) # año/mes/dia
  entryExample2= Entry.create(solution:solutionExample2, entry_number: 2, entry_date: Date.new(2024,8,3)) 
  entryExample3= Entry.create(solution:solutionExample3, entry_number: 3, entry_date: Date.new(2024,8,7)) 
  entryExample4= Entry.create(solution:solutionExample4, entry_number: 4, entry_date: Date.new(2024,8,16))
  entryExample5= Entry.create(solution:solutionExample5, entry_number: 5, entry_date: Date.new(2024,8,19))
  entryExample6= Entry.create(solution:solutionExample6, entry_number: 6, entry_date: Date.new(2024,8,21))
  entryExample7= Entry.create(solution:solutionExample7, entry_number: 7, entry_date: Date.new(2024,8,31))
  entryExample8= Entry.create(solution:solutionExample8, entry_number: 8, entry_date: Date.new(2024,9,1))
  entryExample9= Entry.create(solution:solutionExample9, entry_number: 9, entry_date: Date.new(2024,9,1))
  entryExample10= Entry.create(solution:solutionExample10, entry_number: 10, entry_date: Date.new(2024,9,5))
  entryExample11= Entry.create(solution:solutionExample11, entry_number: 11, entry_date: Date.new(2024,9,16))
  entryExample12= Entry.create(solution:solutionExample12, entry_number: 12, entry_date: Date.new(2024,9,21))
  entryExample13= Entry.create(solution:solutionExample13, entry_number: 13, entry_date: Date.new(2024,9,25))
  entryExample14= Entry.create(solution:solutionExample14, entry_number: 14, entry_date: Date.new(2024,9,28))
  entryExample15= Entry.create(solution:solutionExample15, entry_number: 15, entry_date: Date.new(2024,9,29))
  entryExample16= Entry.create(solution:solutionExample16, entry_number: 16, entry_date: Date.new(2024,9,30))

  # Creación de cuentas / Si está en la base de datos, no se crea
  Account.find_or_create_by(account_number: 174) do |account|
    account.description = "Acreedores por arrendamiento financiero a largo plazo"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por arrendamiento financiero a largo plazo"
  end
  
  Account.find_or_create_by(account_number: 218) do |account|
    account.description = "Elementos de transporte"
    account.accounting_plan = accPlanPyme
    account.name = "Elementos de transporte"
  end
  
  Account.find_or_create_by(account_number: 281) do |account|
    account.description = "Amortización acumulada del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Amortización acumulada del inmovilizado material"
  end
  
  Account.find_or_create_by(account_number: 400) do |account|
    account.description = "Proveedores"
    account.accounting_plan = accPlanPyme
    account.name = "Proveedores"
  end
  
  Account.find_or_create_by(account_number: 407) do |account|
    account.description = "Anticipo a proveedores"
    account.accounting_plan = accPlanPyme
    account.name = "Anticipo a proveedores"
  end
  
  Account.find_or_create_by(account_number: 410) do |account|
    account.description = "Acreedores por prestaciones de servicios"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por prestaciones de servicios"
  end
  
  Account.find_or_create_by(account_number: 430) do |account|
    account.description = "Clientes"
    account.accounting_plan = accPlanPyme
    account.name = "Clientes"
  end
  
  Account.find_or_create_by(account_number: 437) do |account|
    account.description = "Envases y embalajes a devolver por clientes"
    account.accounting_plan = accPlanPyme
    account.name = "Envases y embalajes a devolver por clientes"
  end
  
  Account.find_or_create_by(account_number: 441) do |account|
    account.description = "Deudores, efectos comerciales a cobrar"
    account.accounting_plan = accPlanPyme
    account.name = "Deudores, efectos comerciales a cobrar"
  end
  
  Account.find_or_create_by(account_number: 460) do |account|
    account.description = "Anticipo de remuneraciones"
    account.accounting_plan = accPlanPyme
    account.name = "Anticipo de remuneraciones"
  end
  
  Account.find_or_create_by(account_number: 465) do |account|
    account.description = "Remuneraciones pendientes de pago"
    account.accounting_plan = accPlanPyme
    account.name = "Remuneraciones pendientes de pago"
  end
  
  Account.find_or_create_by(account_number: 476) do |account|
    account.description = "Organismos de la Seguridad Social, acreedores"
    account.accounting_plan = accPlanPyme
    account.name = "Organismos de la Seguridad Social, acreedores"
  end
  
  Account.find_or_create_by(account_number: 524) do |account|
    account.description = "Acreedores por arrendamiento financiero a corto plazo"
    account.accounting_plan = accPlanPyme
    account.name = "Acreedores por arrendamiento financiero a corto plazo"
  end
  
  Account.find_or_create_by(account_number: 570) do |account|
    account.description = "Caja, euros"
    account.accounting_plan = accPlanPyme
    account.name = "Caja, euros"
  end
  
  Account.find_or_create_by(account_number: 572) do |account|
    account.description = "Banco e instituciones de crédito c/c vista, euros"
    account.accounting_plan = accPlanPyme
    account.name = "Banco e instituciones de crédito c/c vista, euros"
  end
  
  Account.find_or_create_by(account_number: 600) do |account|
    account.description = "Compras"
    account.accounting_plan = accPlanPyme
    account.name = "Compras de mercaderías"
  end
  
  Account.find_or_create_by(account_number: 602) do |account|
    account.description = "Compras de otros aprovisionamientos"
    account.accounting_plan = accPlanPyme
    account.name = "Compras de otros aprovisionamientos"
  end
  
  Account.find_or_create_by(account_number: 606) do |account|
    account.description = "Descuentos sobre compras por pronto pago"
    account.accounting_plan = accPlanPyme
    account.name = "Descuentos sobre compras por pronto pago"
  end
  
  Account.find_or_create_by(account_number: 608) do |account|
    account.description = "Devoluciones de compras y operaciones similares"
    account.accounting_plan = accPlanPyme
    account.name = "Devoluciones de compras y operaciones similares"
  end
  
  Account.find_or_create_by(account_number: 623) do |account|
    account.description = "Servicios de profesionales independientes"
    account.accounting_plan = accPlanPyme
    account.name = "Servicios de profesionales independientes"
  end
  
  Account.find_or_create_by(account_number: 628) do |account|
    account.description = "Suministros"
    account.accounting_plan = accPlanPyme
    account.name = "Suministros"
  end
  
  Account.find_or_create_by(account_number: 640) do |account|
    account.description = "Sueldos y salarios"
    account.accounting_plan = accPlanPyme
    account.name = "Sueldos y salarios"
  end
  
  Account.find_or_create_by(account_number: 642) do |account|
    account.description = "Seguridad Social a cargo de la empresa"
    account.accounting_plan = accPlanPyme
    account.name = "Seguridad Social a cargo de la empresa"
  end
  
  Account.find_or_create_by(account_number: 662) do |account|
    account.description = "Intereses de deudas"
    account.accounting_plan = accPlanPyme
    account.name = "Intereses de deudas"
  end
  
  Account.find_or_create_by(account_number: 671) do |account|
    account.description = "Pérdidas procedentes del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Pérdidas procedentes del inmovilizado material"
  end
  
  Account.find_or_create_by(account_number: 681) do |account|
    account.description = "Amortización del inmovilizado material"
    account.accounting_plan = accPlanPyme
    account.name = "Amortización del inmovilizado material"
  end
  
  Account.find_or_create_by(account_number: 700) do |account|
    account.description = "Ventas de mercaderías"
    account.accounting_plan = accPlanPyme
    account.name = "Ventas de mercaderías"
  end
  
  Account.find_or_create_by(account_number: 4751) do |account|
    account.description = "Hacienda Pública, acreedora por retenciones practicadas"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, acreedora por retenciones practicadas"
  end
  
  Account.find_or_create_by(account_number: 4727) do |account|
    account.description = "Hacienda Pública, IGIC soportado"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, IGIC soportado"
  end
  
  Account.find_or_create_by(account_number: 4757) do |account|
    account.description = "Hacienda Pública, acreedora por IGIC"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública, acreedora por IGIC"
  end
  
  Account.find_or_create_by(account_number: 4777) do |account|
    account.description = "Hacienda Pública IGIC repercutido"
    account.accounting_plan = accPlanPyme
    account.name = "Hacienda Pública IGIC repercutido"
  end
  
  account174 = Account.find_by(account_number: 174)
  account218 = Account.find_by(account_number: 218)
  account281 = Account.find_by(account_number: 281)
  account400 = Account.find_by(account_number: 400)
  account407 = Account.find_by(account_number: 407)
  account410 = Account.find_by(account_number: 410)
  account430 = Account.find_by(account_number: 430)
  account437 = Account.find_by(account_number: 437)
  account441 = Account.find_by(account_number: 441)
  account460 = Account.find_by(account_number: 460)
  account465 = Account.find_by(account_number: 465)
  account476 = Account.find_by(account_number: 476)
  account524 = Account.find_by(account_number: 524)
  account570 = Account.find_by(account_number: 570)
  account572 = Account.find_by(account_number: 572)
  account600 = Account.find_by(account_number: 600)
  account602 = Account.find_by(account_number: 602)
  account606 = Account.find_by(account_number: 606)
  account608 = Account.find_by(account_number: 608)
  account623 = Account.find_by(account_number: 623)
  account628 = Account.find_by(account_number: 628)
  account640 = Account.find_by(account_number: 640)
  account642 = Account.find_by(account_number: 642)
  account662 = Account.find_by(account_number: 662)
  account671 = Account.find_by(account_number: 671)
  account681 = Account.find_by(account_number: 681)
  account700 = Account.find_by(account_number: 700)
  account4751 = Account.find_by(account_number: 4751)
  account4727 = Account.find_by(account_number: 4727)
  account4757 = Account.find_by(account_number: 4757)
  account4777 = Account.find_by(account_number: 4777)


  annotationExample1 = Annotation.create(entry: entryExample1, account: account407, number: 1, debit: 1200.00 , credit: "")
  annotationExample2 = Annotation.create(entry: entryExample1, account: account4727, number: 2, debit: 84.00 , credit: "")
  annotationExample3 = Annotation.create(entry: entryExample1, account: account572, number: 3, debit: "" , credit: 1284.00)

  annotationExample4 = Annotation.create(entry: entryExample2, account: account600, number: 1, debit: 2940.00 , credit: "")
  annotationExample5 = Annotation.create(entry: entryExample2, account: account602, number: 2, debit: 50.00 , credit: "")
  annotationExample6 = Annotation.create(entry: entryExample2, account: account4727, number: 3, debit: 125.30 , credit: "")
  annotationExample7 = Annotation.create(entry: entryExample2, account: account407, number: 4, debit: "" , credit: 1200.00)
  annotationExample8 = Annotation.create(entry: entryExample2, account: account400, number: 5, debit: "" , credit: 1915.30)

  annotationExample9 = Annotation.create(entry: entryExample3, account: account400, number: 1, debit: 419.71 , credit: "")
  annotationExample10 = Annotation.create(entry: entryExample3, account: account608, number: 2, debit: "" , credit: 392.25)
  annotationExample11 = Annotation.create(entry: entryExample3, account: account4727, number: 3, debit: "" , credit: 27.46)

  annotationExample12 = Annotation.create(entry: entryExample4, account: account400, number: 1, debit: 1495.59 , credit: "")
  annotationExample13 = Annotation.create(entry: entryExample4, account: account606, number: 2, debit: "" , credit: 150.00)
  annotationExample14 = Annotation.create(entry: entryExample4, account: account4727, number: 3, debit: "" , credit: 10.50)
  annotationExample15 = Annotation.create(entry: entryExample4, account: account572, number: 4, debit: "" , credit: 1335.09)

  annotationExample16 = Annotation.create(entry: entryExample5, account: account623, number: 1, debit: 450.00 , credit: "")
  annotationExample17 = Annotation.create(entry: entryExample5, account: account4727, number: 2, debit: 31.50 , credit: "")
  annotationExample18 = Annotation.create(entry: entryExample5, account: account4751, number: 3, debit: "" , credit: 31.50)
  annotationExample19 = Annotation.create(entry: entryExample5, account: account410, number: 4, debit: "" , credit: 450.00)
  annotationExample20 = Annotation.create(entry: entryExample5, account: account410, number: 5, debit: 450.00 , credit: "")
  annotationExample21 = Annotation.create(entry: entryExample5, account: account572, number: 6, debit: "" , credit: 450.00)

  annotationExample22 = Annotation.create(entry: entryExample6, account: account460, number: 1, debit: 600.00 , credit: "")
  annotationExample23 = Annotation.create(entry: entryExample6, account: account570, number: 2, debit: "" , credit: 600.00)

  annotationExample24 = Annotation.create(entry: entryExample7, account: account640, number: 1, debit: 7500.00 , credit: "")
  annotationExample25 = Annotation.create(entry: entryExample7, account: account642, number: 2, debit: 1875.00 , credit: "")
  annotationExample26 = Annotation.create(entry: entryExample7, account: account460, number: 3, debit: "", credit: 600.00)
  annotationExample27 = Annotation.create(entry: entryExample7, account: account4751, number: 4, debit: "" , credit: 975.00)
  annotationExample28 = Annotation.create(entry: entryExample7, account: account476, number: 5, debit: "" , credit: 2250.00)
  annotationExample29 = Annotation.create(entry: entryExample7, account: account465, number: 6, debit: "" , credit: 5550.00)

  annotationExample30 = Annotation.create(entry: entryExample8, account: account218, number: 1, debit: 32503.15 , credit: "")
  annotationExample31 = Annotation.create(entry: entryExample8, account: account524, number: 2, debit: "" , credit: 15531.48)
  annotationExample32 = Annotation.create(entry: entryExample8, account: account174, number: 3, debit: "" , credit: 16971.67)

  annotationExample33 = Annotation.create(entry: entryExample9, account: account524, number: 1, debit: 5024.91 , credit: "")
  annotationExample34 = Annotation.create(entry: entryExample9, account: account662, number: 2, debit: 975.09 , credit: "")
  annotationExample35 = Annotation.create(entry: entryExample9, account: account4727, number: 3, debit: 420.00 , credit: "")
  annotationExample36 = Annotation.create(entry: entryExample9, account: account572, number: 4, debit: "" , credit: 6420.00)

  annotationExample37 = Annotation.create(entry: entryExample10, account: account465, number: 1, debit: 5550.00 , credit: "")
  annotationExample38 = Annotation.create(entry: entryExample10, account: account572, number: 2, debit: "" , credit: 5550.00)

  annotationExample39 = Annotation.create(entry: entryExample11, account: account430, number: 1, debit: 8560.00 , credit: "")
  annotationExample40 = Annotation.create(entry: entryExample11, account: account700, number: 2, debit: "" , credit: 7900.00)
  annotationExample41 = Annotation.create(entry: entryExample11, account: account437, number: 3, debit: "" , credit: 100.00)
  annotationExample42 = Annotation.create(entry: entryExample11, account: account4777, number: 4, debit: "" , credit: 560.00)

  annotationExample43 = Annotation.create(entry: entryExample12, account: account681, number: 1, debit: 2000.00 , credit: "")
  annotationExample44 = Annotation.create(entry: entryExample12, account: account281, number: 2, debit: "" , credit: 2000.00)
  annotationExample45 = Annotation.create(entry: entryExample12, account: account681, number: 3, debit: 2882.19 , credit: "")
  annotationExample46 = Annotation.create(entry: entryExample12, account: account281, number: 4, debit: "" , credit: 2882.19)
  annotationExample47 = Annotation.create(entry: entryExample12, account: account281, number: 5, debit: 4882.19 , credit: "")
  annotationExample48 = Annotation.create(entry: entryExample12, account: account671, number: 6, debit: 3117.81 , credit: "")
  annotationExample49 = Annotation.create(entry: entryExample12, account: account572, number: 7, debit: 9639.00 , credit: "")
  annotationExample50 = Annotation.create(entry: entryExample12, account: account441, number: 8, debit: 9630.00 , credit: "")
  annotationExample51 = Annotation.create(entry: entryExample12, account: account218, number: 9, debit: "" , credit: 26000.00)
  annotationExample52 = Annotation.create(entry: entryExample12, account: account4777, number: 10, debit: "" , credit: 1260.00)
  puts "Creada annotation con cuenta: #{annotationExample52.account.account_number}"

  annotationExample53 = Annotation.create(entry: entryExample13, account: account628, number: 1, debit: 120.00 , credit: "")
  annotationExample54 = Annotation.create(entry: entryExample13, account: account4727, number: 2, debit: 8.40 , credit: "")
  annotationExample55 = Annotation.create(entry: entryExample13, account: account410, number: 3, debit: "" , credit: 128.40)
  
  annotationExample56 = Annotation.create(entry: entryExample14, account: account640, number: 1, debit: 7500.00 , credit: "")
  annotationExample57 = Annotation.create(entry: entryExample14, account: account642, number: 2, debit: 1875.00 , credit: "")
  annotationExample58 = Annotation.create(entry: entryExample14, account: account4751, number: 3, debit: "" , credit: 975.00)
  annotationExample59 = Annotation.create(entry: entryExample14, account: account476, number: 4, debit: "" , credit: 2250.00)
  annotationExample60 = Annotation.create(entry: entryExample14, account: account465, number: 5, debit: "" , credit: 6150.00)
  annotationExample61 = Annotation.create(entry: entryExample14, account: account465, number: 6, debit: 6150.00 , credit: "")
  annotationExample62 = Annotation.create(entry: entryExample14, account: account572, number: 7, debit: "" , credit: 6150.00)

  annotationExample63 = Annotation.create(entry: entryExample15, account: account476, number: 1, debit: 2250.00 , credit: "")
  annotationExample64 = Annotation.create(entry: entryExample15, account: account572, number: 2, debit: "" , credit: 2250.00)

  annotationExample65 = Annotation.create(entry: entryExample16, account: account4777, number: 1, debit: 1820.00 , credit: "")
  annotationExample66 = Annotation.create(entry: entryExample16, account: account4727, number: 2, debit: "" , credit: 631.24)
  annotationExample67 = Annotation.create(entry: entryExample16, account: account4757, number: 3, debit: "" , credit: 1188.76)
