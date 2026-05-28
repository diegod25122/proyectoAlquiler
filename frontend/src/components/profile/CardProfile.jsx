import useDarkMode from "../../hooks/useDarkMode";

export const CardProfile = () => {

    return (

        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div className="relative">

                <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="m-auto rounded-full border-2 border-gray-300" width={120} height={120} />
                
                <label className="absolute bottom-0 right-0 bg-blue-400  text-white rounded-full p-2 cursor-pointer hover:bg-emerald-400">📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>

            </div>


            {/* Campo Nombre */}
            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3"></p>
            </div>


            {/* Campo Apellido */}
            <div className="self-start">
                <b>Apellido:</b><p className="inline-block ml-3"></p>
            </div >


            {/* Campo Dirección */}
            <div className="self-start">
                <b>Dirección:</b><p className="inline-block ml-3"></p>
            </div>


            {/* Campo Celular */}
            <div className="self-start">
                <b>Celular:</b><p className="inline-block ml-3"></p>
            </div>

            
            {/* Campo Correo Electrónico */}
            <div className="self-start">
                <b>Correo:</b><p className="inline-block ml-3"></p>
            </div>
        
        </div>
    )
}