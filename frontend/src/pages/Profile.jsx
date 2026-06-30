import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import useDarkMode from '../hooks/useDarkMode'
import storeProfile from '../context/storeProfile'
import { CardProfileOwner } from '../components/profile/CardProfileOwner'

const Profile = () => {
    const isDarkMode = useDarkMode(state => state.isDarkMode)
    const { user } = storeProfile()  // ← Bug 1 resuelto: ahora user existe

    return (
        <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-white dark:bg-gray-900 
                         text-gray-800 dark:text-gray-200 p-4 transition-colors duration-300`}>
            <div className="mb-6">
                <h1 className='font-black text-4xl text-gray-500 dark:text-gray-300'>Perfil</h1>
                <hr className='my-4 border-gray-200 dark:border-gray-750' />
                <p className='text-gray-600 dark:text-gray-400'>
                    Este módulo te permite gestionar el perfil del usuario
                </p>
            </div>

            {/* Bug 2 resuelto: preguntamos si ES Admin, no si es Usuario */}
            {user?.rol === 'Admin' ? (
                <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                    <div className='w-full md:w-1/2'>
                        <FormProfile />
                    </div>
                    <div className='w-full md:w-1/2 flex flex-col gap-y-6'>
                        <CardProfile />
                    </div>
                </div>
            ) : (
                <CardProfileOwner />
            )}
        </div>
    )
}

export default Profile