// src/pages/dashboard/RegistrarHerramienta.jsx
import { useState } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import storeProducto from "../../context/storeProducto"
import generateAvatar from "../../helpers/consultarIA"

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/2618/2618671.png"

const RegistrarProducto = () => {
    const { registrarProducto } = storeHerramienta()
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm()

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
        formData.append("nombre", dataForm.nombre)
        formData.append("codigoInventario", dataForm.codigoInventario)
        formData.append("descripcion", dataForm.descripcion)
        formData.append("categoria", dataForm.categoria)
        formData.append("tipo", dataForm.tipo)
        formData.append("stock", dataForm.stock)
        if (dataForm.tipo === "Consumible" && dataForm.precio) {
            formData.append("precio", dataForm.precio)
        }
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

            <div className="flex flex-col items-center mb-5">
                <img
                    src={imagenState.preview}
                    alt="preview herramienta"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 mb-3"
                />

                {imagenState.modo === "subir" ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                    />
                ) : (
                    <div className="w-full flex gap-2">
                        <input
                            type="text"
                            placeholder="Describe la herramienta (ej: taladro industrial rojo)"
                            value={imagenState.prompt}
                            onChange={(e) => setImagenState((prev) => ({ ...prev, prompt: e.target.value }))}
                            className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={imagenState.loading}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-600 disabled:opacity-50"
                        >
                            {imagenState.loading ? "Generando..." : "Generar"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                    type="text"
                    placeholder="Ej: Taladro Bosch"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Código de inventario</label>
                <input
                    type="text"
                    placeholder="Ej: HER-0023"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    {...register("codigoInventario", { required: "El código es obligatorio" })}
                />
                {errors.codigoInventario && <p className="text-red-600 text-sm mt-1">{errors.codigoInventario.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Categoría</label>
                    <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        {...register("categoria", { required: "La categoría es obligatoria" })}
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
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Tipo</label>
                    <select
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        {...register("tipo", { required: "El tipo es obligatorio" })}
                    >
                        <option value="">Seleccione el tipo</option>
                        <option value="Prestable">Prestable</option>
                        <option value="Consumible">Consumible</option>
                    </select>
                    {errors.tipo && <p className="text-red-600 text-sm mt-1">{errors.tipo.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</label>
                    <input
                        type="number"
                        placeholder="Ej: 5"
                        min="0"
                        defaultValue="1"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                        {...register("stock", { 
                            required: "El stock es obligatorio", 
                            min: { value: 0, message: "El stock no puede ser menor a cero" } 
                        })}
                    />
                    {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
                </div>

                {tipoSeleccionado === "Consumible" && (
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Precio ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ej: 12.50"
                            min="0.01"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                            {...register("precio", { 
                                required: "El precio es obligatorio para consumibles",
                                min: { value: 0.01, message: "El precio debe ser mayor a 0" }
                            })}
                        />
                        {errors.precio && <p className="text-red-600 text-sm mt-1">{errors.precio.message}</p>}
                    </div>
                )}
            </div>

            <div className="mb-5">
                <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea
                    rows={3}
                    placeholder="Detalles de la herramienta..."
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 bg-white dark:bg-gray-800 dark:text-white"
                    {...register("descripcion", { required: "La descripción es obligatoria" })}
                />
                {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>}
            </div>

            <button
                type="submit"
                className="bg-blue-600 w-full p-2.5 text-white uppercase font-bold rounded-lg hover:bg-blue-700 transition-all"
            >
                Registrar
            </button>
        </form>
    )
}

export default RegistrarProducto