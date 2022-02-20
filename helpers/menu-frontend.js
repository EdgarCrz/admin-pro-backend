// Con este metodo recibimos el role de el usuario en la parte de los login (o donde sea que iniciemos sesion y generemos un jwt)
// con ese role vamos a agregar las opciones deseadas para ese role, por ejemplo si el usuario tiene un USER_ROLE tendra acceso a todas las rutas
// menos a la de usuarios.

// Y si el role es un ADMIN_ROLE se le agregara este objeto con la ruta
//Al final de este metodo retornamos el "menu" que es el objeto con todas nuestras rutas que deseamos que ese usuario tenga acceso
// Por en caso de no recibir un rol, el rol por defecto será "USER_ROLE"
const getMenuFrontEnd = (role = "USER_ROLE") => {
  
  const menu = [
    // Este objeto, era el mismo que teniamos en el lado del frontend, y lo reusamos aqui para despues mandarlo al mismo lugar donde estaba el otro, con la diferencia que devolveremos el menu personalizado para cada tipo de usaurio en este caso solo hicimos para el user role y para el admin role pero podemos agregar mas usuarios 
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Dashboard", url: "/" },
        { titulo: "ProgressBar", url: "progress" },
        { titulo: "Graficas", url: "grafica1" },
        { titulo: "Promesas", url: "promesas" },
        { titulo: "Rxjs", url: "rxjs" },
      ],
    },
    {
      titulo: "Mantenimiento",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        // { titulo: 'Usuario', url: 'usuarios' }, // esta opcion se quito ya que un usuario normal no deberia poder ver esta ruta
        { titulo: "Hospitales", url: "hospitales" },
        { titulo: "Médicos", url: "medicos" },
        { titulo: "Médico", url: "medico/:id" },
      ],
    },
  ];
// Si el usuario es un ADMIN le agregamos tambien esa opcion, asi podemos jugar con las opciones que queramos que el usuario pueda ver dependiendo de su rol
  if (role === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ titulo: "Usuario", url: "usuarios" });
  }
  return menu;
};

module.exports = {
  getMenuFrontEnd,
};
