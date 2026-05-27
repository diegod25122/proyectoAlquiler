import { check, validationResult } from 'express-validator';

const validacionRegistro = [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('facultad', 'La facultad es obligatoria').notEmpty(),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    check('cedula', 'La cédula debe tener exactamente 10 dígitos numéricos').isLength({ min: 10, max: 10 }).isNumeric(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    }
];

export { validacionRegistro };