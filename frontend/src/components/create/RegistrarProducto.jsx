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
            categoria: ""
        }
    })

    const tipoSeleccionado = watch("tipo")

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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <ToastContainer />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">
                Registrar nueva herramienta
            </h2>

            {/* Alternador de Modo de Imagen */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setImagenState((prev) => ({ ...prev, modo: "subir" }))}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                        ${imagenState.modo === "subir" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                    Subir imagen
                </button>
                <button
                    type="button"
                    onClick={() => setImagenState((prev) => ({ ...prev, modo: "ia" }))}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                        ${imagenState.modo === "ia" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                    Generar con IA
                </button>
            </div>

            {/* Sección Visual de la Imagen */}
            <div className="flex flex-col items-center mb-5 border-b border-gray-100 dark:border-gray-800 pb-5">
                <img
                    src={imagenState.preview}
                    alt="preview herramienta"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 mb-3 shadow-sm"
                />

                {imagenState.modo === "subir" ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 dark:file:bg-gray-800 dark:file:text-gray-300"
                    />
                ) : (
                    <div className="w-full flex gap-2">
                        <input
                            type="text"
                            placeholder="Describe la herramienta (ej: taladro industrial rojo)"
                            value={imagenState.prompt}
                            onChange={(e) => setImagenState((prev) => ({ ...prev, prompt: e.target.value }))}
                            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 py-2 px-3 text-sm dark:bg-gray-800 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={imagenState.loading}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-600 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                            {imagenState.loading ? "Generando..." : "Generar"}
                        </button>
                    </div>
                )}
            </div>

            {/* Input Nombre */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre del Producto *</label>
                <input
                    type="text"
                    placeholder="Ej: Osciloscopio Digital 100MHz"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...register("nombre", { required: "El nombre es mandatorio para el registro" })}
                />
                {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            {/* Input Código de Inventario */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Código de Inventario Institucional *</label>
                <input
                    type="text"
                    placeholder="Ej: ESFOT-HER-0042"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...register("codigoInventario", { required: "El código de inventario es obligatorio" })}
                />
                {errors.codigoInventario && <p className="text-red-600 text-sm mt-1">{errors.codigoInventario.message}</p>}
            </div>

            {/* Grid Selectores: Categoría y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Categoría *</label>
                    <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        {...register("categoria", { required: "Debes seleccionar una categoría" })}
                    >
                        <option value="">Seleccione una categoría</option>
                        <option value="Manuales">Manuales</option>
                        <option value="Tecnológicas">Tecnológicas</option>
                        <option value="Ópticas">Ópticas</option>
                        <option value="Consumibles">Consumibles</option>
                    </select>
                    {errors.categoria && <p className="text-red-600 text-sm mt-1">{errors.categoria.message}</p>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Tipo de Distribución *</label>
                    <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        {...register("tipo", { required: "El tipo es obligatorio para la lógica de negocio" })}
                    >
                        <option value="">Seleccione el tipo</option>
                        <option value="Prestable">Prestable (Préstamo de activo)</option>
                        <option value="Consumible">Consumible (Compra/Pago requerido)</option>
                    </select>
                    {errors.tipo && <p className="text-red-600 text-sm mt-1">{errors.tipo.message}</p>}
                </div>
            </div>

            {/* Grid Numéricos: Stock y Precio Condicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Unidades en Stock *</label>
                    <input
                        type="number"
                        placeholder="Ej: 5"
                        min="0"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        {...register("stock", { 
                            required: "El stock es obligatorio", 
                            min: { value: 0, message: "El stock mínimo permitido es 0 unidades" } 
                        })}
                    />
                    {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
                </div>

                {tipoSeleccionado === "Consumible" && (
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Precio Unitario ($) *</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ej: 3.75"
                            min="0.01"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            {...register("precio", { 
                                required: "El precio es obligatorio para artículos consumibles",
                                min: { value: 0.01, message: "El precio debe ser un valor positivo mayor a 0" }
                            })}
                        />
                        {errors.precio && <p className="text-red-600 text-sm mt-1">{errors.precio.message}</p>}
                    </div>
                )}
            </div>

            {/* Textarea Descripción */}
            <div className="mb-5">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Descripción Técnica *</label>
                <textarea
                    rows={3}
                    placeholder="Especificaciones, estado actual o componentes incluidos..."
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...register("descripcion", { required: "La descripción técnica es obligatoria" })}
                />
                {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>}
            </div>

            {/* Botón de Envío */}
            <button
                type="submit"
                className="bg-blue-600 w-full p-2.5 text-white uppercase font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md tracking-wide"
            >
                Registrar Producto
            </button>
        </form>
    )
}

export default RegistrarProducto 