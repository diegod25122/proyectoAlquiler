import { useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import storeProducto from "../../context/storeProducto"
import generateAvatar from "../../helpers/consultarIA"

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/2618/2618671.png"

const RegistrarProducto = () => {
    const { registrarProducto } = storeProducto()
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        defaultValues: {
            stock: 1,
            tipo: "",
            categoria: "",
            generadoConIA: false,
            estado: true,
        }
    })

    const tipoSeleccionado = watch("tipo")
    const generadoConIA = watch("generadoConIA")
    const estado = watch("estado")

    const [imagenState, setImagenState] = useState({
        preview: DEFAULT_IMAGE,
        prompt: "",
        loading: false,
        modo: "subir",
    })

    const handleGenerateImage = async () => {
        if (!imagenState.prompt.trim()) {
            toast.error("Escribe una descripción para generar la imagen")
            return
        }
        setImagenState((prev) => ({ ...prev, loading: true }))
        try {
            const blob = await generateAvatar(imagenState.prompt)
            if (!blob?.type?.startsWith("image/")) throw new Error("No es una imagen válida")

            const file = new File([blob], "herramienta.png", { type: blob.type })
            const imageUrl = URL.createObjectURL(blob)

            setImagenState((prev) => ({ ...prev, preview: imageUrl, loading: false }))
            setValue("imagen", [file])
        } catch (error) {
            console.error(error)
            toast.error("Error al generar la imagen con IA")
            setImagenState((prev) => ({ ...prev, preview: DEFAULT_IMAGE, loading: false }))
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImagenState((prev) => ({ ...prev, preview: URL.createObjectURL(file) }))
        setValue("imagen", [file])
    }

    const onSubmit = async (dataForm) => {
        const formData = new FormData()
        
        // Empaquetado estricto de campos de texto obligatorios
        formData.append("nombre", dataForm.nombre.trim())
        formData.append("codigoInventario", dataForm.codigoInventario.trim().toUpperCase())
        formData.append("descripcion", dataForm.descripcion.trim())
        formData.append("categoria", dataForm.categoria)
        formData.append("tipo", dataForm.tipo)
        
        // Tipos numéricos limpios para Mongoose
        formData.append("stock", parseInt(dataForm.stock, 10))

        // Si es consumible, adjuntar el precio parseado numéricamente
        if (dataForm.tipo === "Consumible" && dataForm.precio) {
            formData.append("precio", parseFloat(dataForm.precio))
        }

        // Campos adicionales
        formData.append("generadoConIA", dataForm.generadoConIA)
        formData.append("estado", dataForm.estado)

        // Imagen obligatoria u opcional dependiendo de tus requerimientos de backend
        if (dataForm.imagen?.[0]) {
            formData.append("imagen", dataForm.imagen[0])
        }

        const exito = await registrarProducto(formData)
        if (exito) {
            setTimeout(() => navigate("/dashboard/list"), 1500)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <ToastContainer />
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
                        📦
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Registrar Nuevo Producto
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-12">
                    Complete la información del producto para agregarlo al inventario.
                </p>
            </div>

            {/* Contenedor Principal - Dos Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-6">
                
                {/* COLUMNA IZQUIERDA - Información Básica */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Sección: Información Básica */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 text-blue-600">ℹ️</div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Información Básica
                            </h2>
                        </div>

                        {/* Nombre del Producto */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Nombre del producto <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Taladro Inalámbrico Bosch GSB 120"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("nombre", { required: "El nombre es mandatorio para el registro" })}
                            />
                            {errors.nombre && <p className="text-red-600 text-sm mt-1.5">{errors.nombre.message}</p>}
                        </div>

                        {/* Código de Inventario */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Código de inventario <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: TEC-00125"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("codigoInventario", { required: "El código de inventario es obligatorio" })}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Debe ser único (SKU / Código único)</p>
                            {errors.codigoInventario && <p className="text-red-600 text-sm mt-1.5">{errors.codigoInventario.message}</p>}
                        </div>

                        {/* Grid: Categoría y Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    {...register("categoria", { required: "Debes seleccionar una categoría" })}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    <option value="Manuales">Manuales</option>
                                    <option value="Tecnológicas">Tecnológicas</option>
                                    <option value="Ópticas">Ópticas</option>
                                    <option value="Consumibles">Consumibles</option>
                                </select>
                                {errors.categoria && <p className="text-red-600 text-sm mt-1.5">{errors.categoria.message}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Tipo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    {...register("tipo", { required: "El tipo es obligatorio para la lógica de negocio" })}
                                >
                                    <option value="">Seleccione el tipo</option>
                                    <option value="Prestable">Prestable (Préstamo de activo)</option>
                                    <option value="Consumible">Consumible (Compra/Pago requerido)</option>
                                </select>
                                {errors.tipo && <p className="text-red-600 text-sm mt-1.5">{errors.tipo.message}</p>}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe el producto, sus características y especificaciones..."
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                {...register("descripcion", { required: "La descripción técnica es obligatoria" })}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo 10 caracteres</p>
                            {errors.descripcion && <p className="text-red-600 text-sm mt-1.5">{errors.descripcion.message}</p>}
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA - Inventario y Precio + Imagen */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Sección: Inventario y Precio */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 text-purple-600">💰</div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Inventario y Precio
                            </h2>
                        </div>

                        {/* Stock */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Stock disponible <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Ej: 5"
                                min="0"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 px-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("stock", { 
                                    required: "El stock es obligatorio", 
                                    min: { value: 0, message: "El stock mínimo permitido es 0 unidades" } 
                                })}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cantidad disponible en inventario (mínimo 0)</p>
                            {errors.stock && <p className="text-red-600 text-sm mt-1.5">{errors.stock.message}</p>}
                        </div>

                        {/* Precio Condicional */}
                        {tipoSeleccionado === "Consumible" && (
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Precio unitario <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-semibold">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        min="0.01"
                                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-3 pl-8 pr-4 text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        {...register("precio", { 
                                            required: "El precio es obligatorio para artículos consumibles",
                                            min: { value: 0.01, message: "El precio debe ser un valor positivo mayor a 0" }
                                        })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Precio de venta al público</p>
                                {errors.precio && <p className="text-red-600 text-sm mt-1.5">{errors.precio.message}</p>}
                            </div>
                        )}
                    </div>

                    {/* Sección: Imagen del Producto */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Imagen del producto
                        </h3>

                        {/* Modo Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setImagenState((prev) => ({ ...prev, modo: "subir" }))}
                                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                                    imagenState.modo === "subir" 
                                        ? "bg-blue-600 text-white" 
                                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                                }`}
                            >
                                Subir archivo
                            </button>
                            <button
                                type="button"
                                onClick={() => setImagenState((prev) => ({ ...prev, modo: "ia" }))}
                                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                                    imagenState.modo === "ia" 
                                        ? "bg-blue-600 text-white" 
                                        : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                                }`}
                            >
                                Generar IA
                            </button>
                        </div>

                        {/* Preview de Imagen */}
                        <div className="mb-4">
                            <img
                                src={imagenState.preview}
                                alt="preview herramienta"
                                className="w-100 h-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-sm"
                            />
                        </div>

                        {/* Input Modo Subir */}
                        {imagenState.modo === "subir" ? (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer transition"
                            />
                        ) : (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Ej: taladro rojo industrial"
                                    value={imagenState.prompt}
                                    onChange={(e) => setImagenState((prev) => ({ ...prev, prompt: e.target.value }))}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateImage}
                                    disabled={imagenState.loading}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {imagenState.loading ? "Generando..." : "Generar imagen"}
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            JPG, PNG, WebP. Máx. 5MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección: Configuración Adicional */}
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 text-gray-600 dark:text-gray-400">⚙️</div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Configuración Adicional
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Generado con IA */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                ¿Generado con IA?
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Marcar si el producto fue generado con IA
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-600 cursor-pointer"
                            {...register("generadoConIA")}
                        />
                    </div>

                    {/* Estado del Producto */}
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Estado del producto
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {estado ? "Activo (visible)" : "Inactivo (oculto)"}
                            </p>
                        </div>
                        <div className="relative w-12 h-7">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                {...register("estado")}
                            />
                            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 peer-checked:bg-blue-600 rounded-full transition-colors cursor-pointer peer"></div>
                            <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-transform"></div>
                        </div>
                    </div>

                    {/* Registrado por */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Registrado por
                        </label>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Jairo Maigua (Administrador)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Usuario que registra el producto
                        </p>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="max-w-7xl mx-auto flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/productos")}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                    Guardar Producto
                </button>
            </div>
        </form>
    )
}

export default RegistrarProducto