console.log('PORT:', process.env.PORT);
console.log('Trying to require express...');

try {
    const express = require('express');
    console.log('✅ Express loaded');
} catch (e) {
    console.error('❌', e.message);
}