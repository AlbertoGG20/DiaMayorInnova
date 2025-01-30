export const scRoutes = [];

scRoutes.push({
  to: "/home",
  icon: "fi fi-rr-home",
  name: "home",
  rol: ["student"],
})

scRoutes.push({
  to: "/tasks",
  icon: "fi fi-rr-edit",
  name: "Tarea",
  rol: ["teacher"],
})

scRoutes.push({
  to: "/add-statements",
  icon: "fi fi-rr-pencil",
  name: "Enunciado",
  rol: ["teacher"],
})

scRoutes.push({
  to: "/modes",
  icon: "fi fi-rr-bank",
  name: "modos",
  rol: ["teacher", "student"],
})

scRoutes.push({
  to: "/home/escuelas",
  icon: "fi fi-rr-school",
  name: "Colegios",
  rol: ["admin"],
})

scRoutes.push({
  to: "/accounting-plans",
  icon: "fi fi-rr-book",
  name: "PGC",
  rol: ["teacher", "admin"],
})

scRoutes.push({
  to: "/class-list",
  icon: "fi fi-rr-book",
  name: "Lista Grupos",
  student: false,
  rol: ["teacher", "admin"],
})

scRoutes.push({
  to: "/users",
  icon: "fi fi-rr-user-add",
  name: "Crear Usuario",
  student: false,
  rol: ["admin"],
})
