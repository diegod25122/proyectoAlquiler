<Routes>
    {/* ── Rutas completamente públicas (cualquiera, logueado o no) ── */}
    <Route index element={<Home />} />
    <Route path="/reservar/:id" element={<ReservarProducto />} />
    <Route path="/carrito" element={<Carrito />} />
    <Route path="confirm/:token" element={<Confirm />} />
    <Route path="reset/:token" element={<Reset />} />
    <Route path="*" element={<NotFound />} />

    {/* ── Solo accesibles sin sesión (redirigen al dashboard si logueado) ── */}
    <Route element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot" element={<Forgot />} />
    </Route>

    {/* ── Solo accesibles con sesión ── */}
    <Route path="dashboard/*" element={
        <ProtectedRoute>
            <Routes>
                <Route element={<Dashboard />}>
                    <Route index element={<Panel />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="list" element={<List />} />
                    <Route path="details/:id" element={<Details />} />
                    <Route path="update/:id" element={<PrivateRouteWithRole><Update /></PrivateRouteWithRole>} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="registrar-producto" element={<RegistrarProducto />} />
                    <Route path="reservas" element={<PrivateRouteWithRole><GestionReservas /></PrivateRouteWithRole>} />
                    <Route path="usuarios" element={<PrivateRouteWithRole><GestionUsuarios /></PrivateRouteWithRole>} />
                    <Route path="mis-reservas" element={<MisReservas />} />
                    <Route path="mis-pagos" element={<MisPagos />} />
                </Route>
            </Routes>
        </ProtectedRoute>
    } />
</Routes>