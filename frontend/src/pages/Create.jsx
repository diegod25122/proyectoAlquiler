import { Form } from "react-router"

const Create = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Agregar</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar registros</p>
            <Form />
        </div>
    )
}

export default Create