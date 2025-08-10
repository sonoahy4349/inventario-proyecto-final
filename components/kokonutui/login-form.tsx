export async function signIn({ email, password }: SignInCredentials): Promise<{
  user: AuthUser | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: "No se pudo autenticar al usuario" }
    }

    // Obtener información adicional del usuario de nuestra tabla
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("name, role")
      .eq("id", data.user.id)
      .single()

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: userData?.name,
      role: userData?.role || "Usuario",
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: "Error de conexión" }
  }
}

export async function signUp({ email, password, name, role = "Usuario" }: SignUpCredentials): Promise<{
  user: AuthUser | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: "No se pudo crear el usuario" }
    }

    // Crear registro en nuestra tabla users
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: data.user.id,
        email: data.user.email!,
        name,
        role,
      })

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      // El usuario se creó en auth pero no en nuestra tabla
      return { user: null, error: "Error al crear el perfil de usuario" }
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name,
      role,
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: "Error de conexión" }
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  } catch (error) {
    return { error: "Error al cerrar sesión" }
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Obtener información adicional de nuestra tabla
    const { data: userData } = await supabase
      .from("users")
      .select("name, role")
      .eq("id", user.id)
      .single()

    return {
      id: user.id,
      email: user.email!,
      name: userData?.name,
      role: userData?.role || "Usuario",
    }
  } catch (error) {
    return null
  }
}

export async function getAuthSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}
