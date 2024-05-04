import bcrypt from 'bcryptjs';

export const saltRounds = 10;

export const hashear = contraseña => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(contraseña, salt);
};

export const comparar = (contraseña, hashContraseña) => {
  return bcrypt.compareSync(contraseña, hashContraseña);
};
