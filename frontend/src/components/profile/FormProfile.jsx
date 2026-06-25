import { useEffect, useState } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'

const FormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const updateUser = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarperfil`
        const formData = new FormData()
        formData.append('nombre', dataForm.nombre)
        formData.append('apellido', dataForm.apellido)
        formData.append('facultad', dataForm.facultad)
        formData.append('telefono', dataForm.telefono)
        formData.append('cedula', dataForm.cedula)
        formData.append('email', dataForm.email)

        updateProfile(url, formData)
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user.nombre,
                apellido: user.apellido,
                facultad: user.facultad || '',
                telefono: user.telefono || '',
                cedula: user.cedula || '',
                email: user.email,
            })
        }
    }, [user, reset])

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    return (
        <form onSubmit={handleSubmit(updateUser)}>
            <ToastContainer />

            {/* Imagen de perfil */}


            {/* Campo Nombre */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Nombre</label>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
            </div>

            {/* Campo Apellido */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Apellido</label>
                <input
                    type="text"
                    placeholder="Ingresa tu apellido"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                />
                {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
            </div>

            {/* Campo Facultad */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Facultad</label>
                <input
                    type="text"
                    placeholder="Ingresa tu facultad"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("facultad", { required: "La facultad es obligatoria" })}
                />
                {errors.facultad && <p className="text-red-800">{errors.facultad.message}</p>}
            </div>

            {/* Campo Teléfono */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Teléfono</label>
                <input
                    type="text"
                    inputMode="tel"
                    placeholder="Ingresa tu teléfono"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("telefono", { required: "El teléfono es obligatorio" })}
                />
                {errors.telefono && <p className="text-red-800">{errors.telefono.message}</p>}
            </div>

            {/* Campo Cédula */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Cédula</label>
                <input
                    type="text"
                    placeholder="Ingresa tu cédula"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("cedula", { required: "La cédula es obligatoria" })}
                />
                {errors.cedula && <p className="text-red-800">{errors.cedula.message}</p>}
            </div>

            {/* Campo Correo Electrónico */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("email", { required: "El correo es obligatorio" })}
                />
                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
            </div>

            {/* Botón para actualizar el perfil */}
            <input
                type="submit"
                className='bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all'
                value='Actualizar'
                href="/actualizarperfil"
            />
        </form>
    )
}

export default FormularioPerfil