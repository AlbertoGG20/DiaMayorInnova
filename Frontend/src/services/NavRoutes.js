export const routes = [];

routes.push({
  to: "/home",
  icon: "fi fi-rr-home",
  name: "home",
  rol: ["teacher", "center_admin", "admin", "student"],
})

routes.push({
  to: "/modes/practica",
  icon: "fi fi-rr-bank",
  name: "modo práctica",
  rol: ["teacher", "admin", "center_admin", "student"],
})

routes.push({
  to: "/tasks",
  icon: "fi fi-rr-graduation-cap",
  name: "tareas",
  rol: ["teacher", "center_admin", "admin"],
})


routes.push({
  to: "/schools",
  icon: "fi fi-rr-school",
  name: "gestión escuelas",
  rol: ["center_admin", "admin"],
})

routes.push({
  to: "/accounting-plans",
  icon: "fi fi-rr-book",
  name: "gestión planes contables",
  rol: ["teacher", "center_admin", "admin"],
})

routes.push({
  to: "/accounts",
  icon: "fi fi-rr-credit-card",
  name: "gestión cuentas",
  student: false,
  rol: ["teacher", "center_admin", "admin"],
})
