import React from 'react';
import logoImage from '../../assets/logo.png';

export const Logo = ({ className = "h-10 w-10" }) => {
    return (
        <img
            src={logoImage}
            alt="Logo"
            className={`object-contain ${className}`}
        />
    );
};
