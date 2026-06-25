// src/components/dashboard/FormHerramienta.jsx
/* eslint-disable react/prop-types */
import { useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import generateAvatar from "../../helpers/consultarIA"

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/2618/2618671.png" // ícono genérico de herramienta

export const FormHerramienta = ({ herramienta }) => {
    const [imagenState, setImagenState] = useState({
        preview: herramienta?.imagen || DEFAULT_IMAGE,
        prompt: "",
        loading: false,
        modo: "subir" // "subir" | "ia"
    })

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm()
    const { fetchDataBackend } = useFetch()

    // Generar imagen con IA a partir del prompt
    const handleGenerateImage = async () => {
        if (!imagenState.prompt.trim()) {
            toast.error("Escribe una descripción para generar la imagen")
            return
        }
        setImagenState(prev => ({ ...prev, loading: true }))
        try {
            const blob = await generateAvatar(imagenState.prompt)
            const isImage = blob?.type?.startsWith("image/")
            if (!isImage) throw new Error("No es una imagen válida")

            const file = new File([blob], "herramienta.png", { type: blob.type })
            const imageUrl = URL.createObjectURL(blob)

            setImagenState(prev => ({ ...prev, preview: imageUrl, loading: false }))
            setValue("imagen", [file])
        } catch (error) {
            console.error(error)
            toast.error("Error al generar la imagen con IA")
            setImagenState(prev => ({ ...prev, preview: DEFAULT_IMAGE, loading: false }))
        }
    }

    // Subir imagen manualmente desde archivo
    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setImagenState(prev => ({ ...prev, preview: URL.createObjectURL(file) }))
        setValue("imagen", [file])
    }

    const registrarHerramienta = async (dataForm) => {
        const formData = new FormData()
        Object.keys(dataForm).forEach((key) => {
            if (key === "imagen") {
                if (dataForm.imagen?.[0]) {
                    formData.append("imagen", dataForm.imagen[0])
                }
            } else {
                formData.append(key, dataForm[key])
            }
        })

        let url = `${import.meta.env.VITE_BACKEND_URL}/herramienta/registro`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storedUser?.state?.token}`
        }

        let response
        if (herramienta?._id) {
            url = `${import.meta.env.VITE_BACKEND_URL}/herramienta/actualizar/${herramienta._id}`
            response = await fetchDataBackend(url, formData, "PUT", headers)
        } else {
            response = await fetchDataBackend(url, formData, "POST", headers)
        }

        if (response) {
            setTimeout(() => {
                navigate("/dashboard/herramientas")
            }, 1500)
        }
    }

    return (
        <form onSubmit={handleSubmit(registrarHerramienta)} className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <ToastContainer />
            <h2 className="text-xl font-bold text-gray-800 mb-5">
                {herramienta?._id ? "Editar herramienta" : "Registrar nueva herramienta"}
            </h2>

            {/* Selector de modo de imagen */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setImagenState(prev => ({ ...prev, modo: "subir" }))}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                        ${imagenState.modo === "subir" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                    Subir imagen
                </button>
                <button
                    type="button"
                    onClick={() => setImagenState(prev => ({ ...prev, modo: "ia" }))}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
                        ${imagenState.modo === "ia" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                    Generar con IA
                </button>
            </div>

            {/* Preview */}
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
                            onChange={(e) => setImagenState(prev => ({ ...prev, prompt: e.target.value }))}
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

            {/* Nombre */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Nombre</label>
                <input
                    type="text"
                    placeholder="Ej: Taladro Bosch"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>}
            </div>

            {/* Código de inventario */}
            <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Código de inventario</label>
                <input
                    type="text"
                    placeholder="Ej: HER-0023"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                    {...register("codigoInventario", { required: "El código es obligatorio" })}
                />
                {errors.codigoInventario && <p className="text-red-600 text-sm mt-1">{errors.codigoInventario.message}</p>}
            </div>

            {/* Descripción */}
            <div className="mb-5">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea
                    rows={3}
                    placeholder="Detalles de la herramienta..."
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                    {...register("descripcion", { required: "La descripción es obligatoria" })}
                />
                {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>}
            </div>

            <button
                type="submit"
                className="bg-blue-600 w-full p-2.5 text-white uppercase font-bold rounded-lg hover:bg-blue-700 transition-all"
            >
                {herramienta?._id ? "Actualizar" : "Registrar"}
            </button>
        </form>
    )
}