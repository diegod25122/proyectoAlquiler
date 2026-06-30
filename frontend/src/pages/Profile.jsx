import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import useDarkMode from '../hooks/useDarkMode'
import storeProfile from '../context/storeProfile'
import { CardProfileOwner } from '../components/profile/CardProfileOwner'
const Profile = () => {
    // Obtenemos el estado del modo oscuro de tu hook
    const isDarkMode = useDarkMode(state => state.isDarkMode)
    const {user}=storeProfile()
    return (
        <>
            <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 transition-colors duration-300`}>
                {/* Sección de Encabezado */}
                <div className="mb-6">
                    <h1 className='font-black text-4xl text-gray-500 dark:text-gray-300'>
                        Perfil
                    </h1>
                    <hr className='my-4 border-gray-200 dark:border-gray-750' />
                    <p className='text-gray-600 dark:text-gray-400'>
                        Este módulo te permite gestionar el perfil del usuario
                    </p>
                </div>
                {
                    user && user.rol == 'Usuario'
                    ? (
                        <div className="w-full max-w-md">
                        <CardProfileOwner />
                        </div>
                    ) : (
                        <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                            {/* Formulario perfil */}
                            <div className='w-full md:w-1/2'>
                                <FormProfile />
                            </div>
                            {/* Card para mostrar el perfil y formulario para cambiar la contraseña */}
                            <div className='w-full md:w-1/2 flex flex-col gap-y-6'>
                                <CardProfile />
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Profile