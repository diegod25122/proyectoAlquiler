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
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-950 p-6">
            <ToastContainer />

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">📦</div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registrar Nuevo Producto</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Complete la información para agregar el producto al inventario.</p>
                </div>
            </div>

            {/* Grid principal: campos (izq) + imagen (der) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                
                {/* IZQUIERDA — todos los campos de datos */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-5">

                    {/* Fila 1: Nombre + Código */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Nombre del producto <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Taladro Inalámbrico Bosch"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Código de inventario <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: TEC-00125"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("codigoInventario", { required: "El código es obligatorio" })}
                            />
                            {errors.codigoInventario && <p className="text-red-600 text-xs mt-1">{errors.codigoInventario.message}</p>}
                        </div>
                    </div>

                    {/* Fila 2: Categoría + Tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("categoria", { required: "Selecciona una categoría" })}
                            >
                                <option value="">Seleccione categoría</option>
                                <option value="Manuales">Manuales</option>
                                <option value="Tecnológicas">Tecnológicas</option>
                                <option value="Ópticas">Ópticas</option>
                                <option value="Consumibles">Consumibles</option>
                            </select>
                            {errors.categoria && <p className="text-red-600 text-xs mt-1">{errors.categoria.message}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Tipo <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("tipo", { required: "El tipo es obligatorio" })}
                            >
                                <option value="">Seleccione el tipo</option>
                                <option value="Prestable">Prestable</option>
                                <option value="Consumible">Consumible</option>
                            </select>
                            {errors.tipo && <p className="text-red-600 text-xs mt-1">{errors.tipo.message}</p>}
                        </div>
                    </div>

                    {/* Fila 3: Stock + Precio (condicional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Stock disponible <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Ej: 5"
                                min="0"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("stock", { required: "El stock es obligatorio", min: { value: 0, message: "Mínimo 0" } })}
                            />
                            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message}</p>}
                        </div>
                        {tipoSeleccionado === "Consumible" && (
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Precio unitario <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 font-semibold text-sm">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        min="0.01"
                                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 pl-7 pr-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        {...register("precio", { required: "Precio obligatorio para consumibles", min: { value: 0.01, message: "Precio inválido" } })}
                                    />
                                </div>
                                {errors.precio && <p className="text-red-600 text-xs mt-1">{errors.precio.message}</p>}
                            </div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Descripción <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe el producto, sus características y especificaciones..."
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                            {...register("descripcion", { required: "La descripción es obligatoria" })}
                        />
                        {errors.descripcion && <p className="text-red-600 text-xs mt-1">{errors.descripcion.message}</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/list")}
                            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Guardar Producto
                        </button>
                    </div>
                </div>

                {/* DERECHA — imagen */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Imagen del producto</h3>

                    <div className="flex gap-2 mb-4">
                        {["subir", "ia"].map(modo => (
                            <button key={modo} type="button"
                                onClick={() => setImagenState(prev => ({ ...prev, modo }))}
                                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-colors ${
                                    imagenState.modo === modo ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                            >
                                {modo === "subir" ? "Subir archivo" : "Generar IA"}
                            </button>
                        ))}
                    </div>

                    <img
                        src={imagenState.preview}
                        alt="preview"
                        className="w-full h-44 object-cover rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
                    />

                    {imagenState.modo === "subir" ? (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-xs text-gray-600 dark:text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        />
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Ej: taladro rojo industrial"
                                value={imagenState.prompt}
                                onChange={e => setImagenState(prev => ({ ...prev, prompt: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleGenerateImage}
                                disabled={imagenState.loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {imagenState.loading ? "Generando..." : "Generar imagen"}
                            </button>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-3">JPG, PNG, WebP · Máx. 5 MB</p>
                </div>
            </div>
        </form>
    )
}

export default RegistrarProducto