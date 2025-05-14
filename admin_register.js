const bcrypt = require('bcrypt');
const { storage } = require('./server/storage');

async function createAdminUser() {
  try {
    // Crear hash de la contraseña
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Verificar si el usuario admin ya existe
    const existingUser = await storage.getUserByUsername('admin');
    
    if (existingUser) {
      console.log('El usuario admin ya existe. Nada que hacer.');
      return;
    }
    
    // Crear nuevo usuario admin
    const user = await storage.createUser({
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    });
    
    console.log('Usuario admin creado exitosamente:', {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  }
}

createAdminUser();