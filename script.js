document.querySelectorAll('.btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Esto es útil para analítica básica o solo para saludar
        console.log("El cliente está interesado en: " + e.target.innerText);
        
        // Ejemplo de alerta personalizada antes de redirigir
        // alert("¡Excelente elección! Te estamos llevando a la tienda oficial.");
    });
});

// Cambiar el color del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = "10px 5%";
        header.style.backgroundColor = "#fdf8f5";
    } else {
        header.style.padding = "20px 5%";
        header.style.backgroundColor = "#ffffff";
    }
});