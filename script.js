// 1. Configuración de conexión (Reemplaza con tus datos de Supabase)
const supabaseUrl = 'https://jagcpizogpykjjunyvbo.supabase.co'; //
const supabaseKey = 'sb_publishable_1ma4bUKPeZT95_uWmHmrYA_MA-FXomX'; //
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Función para cargar y mostrar productos automáticamente
async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    
    // Consultamos la tabla 'productos'
    const { data: productos, error } = await _supabase
        .from('productos')
        .select('*');

    if (error) {
        console.error("Error cargando productos:", error);
        return;
    }

    // Limpiamos el contenedor antes de cargar
    contenedor.innerHTML = '';

    // Dibujamos cada producto en el HTML
    productos.forEach(prod => {
        contenedor.innerHTML += `
            <div class="card-product">
                <img src="${prod.imagen_url}" alt="${prod.nombre}">
                <div class="content-card-product">
                    <h3>${prod.nombre}</h3>
                    <p class="brand">${prod.marca || ''}</p>
                    <p class="price">S/ ${prod.precio_venta.toFixed(2)}</p>
                    <button class="btn-main" onclick="pedirWhatsApp('${prod.nombre}')">
                        Comprar por WhatsApp
                    </button>
                </div>
            </div>
        `;
    });
}

// 3. Función para subir nuevos productos (Tu formulario de admin)
async function publicarNuevoProducto() {
    const fotoArchivo = document.getElementById('input-foto').files[0];
    const nombre = document.getElementById('input-nombre').value;
    const costo = parseFloat(document.getElementById('input-costo').value) || 0;
    const venta = parseFloat(document.getElementById('input-venta').value);

    if (!fotoArchivo || !nombre || isNaN(venta)) {
        return alert("Por favor, completa los campos obligatorios.");
    }

    // Subir imagen al Storage
    const nombreUnico = `${Date.now()}_${fotoArchivo.name}`;
    const { data: uploadData, error: uploadError } = await _supabase.storage
        .from('fotos-productos')
        .upload(nombreUnico, fotoArchivo);

    if (uploadError) return alert("Error al subir imagen: " + uploadError.message);

    // Obtener URL de la foto
    const { data: urlData } = _supabase.storage
        .from('fotos-productos')
        .getPublicUrl(nombreUnico);

    // Guardar en la tabla 'productos'
    const { error: dbError } = await _supabase.from('productos').insert([{
        nombre: nombre,
        precio_costo: costo,
        precio_venta: venta,
        imagen_url: urlData.publicUrl,
        stock: 1
    }]);

    if (!dbError) {
        alert("¡Producto añadido con éxito!");
        cargarProductos(); // Recargamos la lista automáticamente
    }
}

// 4. Función para redirigir a WhatsApp con el nombre del producto
function pedirWhatsApp(nombreProducto) {
    const mensaje = `Hola Quiverli, estoy interesada en el producto: ${nombreProducto}`;
    const url = `https://wa.me/message/ES62HSAPWDSZN1?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Ejecutar carga al abrir la página
document.addEventListener('DOMContentLoaded', cargarProductos);