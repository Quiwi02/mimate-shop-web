document.querySelectorAll('.btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Esto es útil para analítica básica o solo para saludar
        console.log("El cliente está interesado en: " + e.target.innerText);
        
        // Ejemplo de alerta personalizada antes de redirigir
        // alert("¡Excelente elección! Te estamos llevando a la tienda oficial.");
    });
});


// Base de datos con Supabase
const supabaseUrl = 'https://jagcpizogpykjjunyvbo.supabase.co';
const supabaseKey = 'sb_publishable_1ma4bUKPeZT95_uWmHmrYA_MA-FXomX';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function publicarNuevoProducto() {
    const fotoArchivo = document.getElementById('input-foto').files[0];
    const nombre = document.getElementById('input-nombre').value;
    const costo = parseFloat(document.getElementById('input-costo').value) || 0; // Si está vacío, es 0
    const venta = parseFloat(document.getElementById('input-venta').value);

    // 1. Subir la imagen al Storage
    const nombreUnico = `${Date.now()}_${fotoArchivo.name}`;
    const { data: uploadData, error: uploadError } = await _supabase.storage
        .from('fotos-productos')
        .upload(nombreUnico, fotoArchivo);

    if (uploadError) return alert("Error al subir imagen: " + uploadError.message);

    // 2. Obtener la URL pública de la foto
    const { data: urlData } = _supabase.storage
        .from('fotos-productos')
        .getPublicUrl(nombreUnico);

    // 3. Guardar el producto en la tabla 'productos'
    const { error: dbError } = await _supabase.from('productos').insert([{
        nombre: nombre,
        precio_costo: costo,
        precio_venta: venta,
        imagen_url: urlData.publicUrl,
        stock: 1
    }]);

    if (!dbError) {
        alert("¡Producto añadido con éxito!");
        location.reload(); 
    }
}