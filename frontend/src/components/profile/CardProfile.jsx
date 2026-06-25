import storeProfile from "../../context/storeProfile"

export const CardProfile = () => {
    const { user } = storeProfile()

    return (
        <div className="bg-white border border-slate-200 h-auto p-4 flex flex-col items-center justify-between shadow-xl rounded-lg">
            <div className="relative">
                <img
                    src={user?.imagen || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"}
                    alt="img-client"
                    className="m-auto rounded-full border-2 border-gray-300 object-cover"
                    width={120}
                    height={120}
                />
            </div>

            <div className="mt-5 w-full space-y-3 text-sm text-gray-700">
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Nombre:</span>
                    <span>{user?.nombre || 'No definido'}</span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Apellido:</span>
                    <span>{user?.apellido || 'No definido'}</span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Correo:</span>
                    <span>{user?.email || 'No definido'}</span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Teléfono:</span>
                    <span>{user?.telefono || 'No definido'}</span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Facultad:</span>
                    <span>{user?.facultad || 'No definido'}</span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="font-semibold">Cédula:</span>
                    <span>{user?.cedula || 'No definido'}</span>
                </div>
            </div>
        </div>
    )
}