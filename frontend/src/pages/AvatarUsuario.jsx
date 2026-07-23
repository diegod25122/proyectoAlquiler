import React from 'react';

export const AvatarUsuario = ({ seed, size = 40, className = "" }) => {
    // Definimos el estilo 'adventurer' (puedes probar 'bottts', 'lorelei', 'avataaars', etc.)
    const style = 'adventurer'; 
    
    // Si no hay seed, usamos un valor por defecto
    const seedLimpio = encodeURIComponent(seed || 'invitado');
    
    // URL directa de la API de DiceBear v7+
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seedLimpio}`;

    return (
        <img
            src={avatarUrl}
            alt={`Avatar de ${seed}`}
            width={size}
            height={size}
            className={`rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${className}`}
            loading="lazy"
        />
    );
};

export default AvatarUsuario;