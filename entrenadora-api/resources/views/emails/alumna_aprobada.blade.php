<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenido a Metodo VIF</title>
</head>
<body style="background-color: #FAF7F2; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; margin: 0;">
    
    <div style="background-color: #ffffff; max-width: 500px; margin: 0 auto; border-radius: 24px; padding: 40px; border: 1px solid #EAE2D6; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <div style="width: 64px; height: 64px; background-color: #384230; color: #FAF7F2; border-radius: 50%; font-size: 24px; font-weight: bold; line-height: 64px; margin: 0 auto 20px auto;">
            V
        </div>

        <h1 style="color: #1A1412; font-size: 24px; margin-bottom: 15px;">¡Hola, {{ explode(' ', trim($usuario->nombre))[0] }}!</h1>
        
        <p style="color: #5C524B; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            ¡Vero ya habilitó tu perfil! Ya está todo listo para que empieces a darlo todo y cumplir tus objetivos. A continuación, te dejamos el detalle de tu membresía:
        </p>

        <div style="background-color: #FAF7F2; border: 1px solid #EAE2D6; border-radius: 16px; padding: 20px; margin-bottom: 30px; text-align: left;">
            <h3 style="color: #1A1412; font-size: 18px; margin-top: 0; margin-bottom: 10px;">
                Plan {{ $plan ? $plan->titulo : 'Asignado' }}
            </h3>
            <p style="color: #5C524B; font-size: 14px; margin: 0 0 15px 0; line-height: 1.5; white-space: pre-line;">
                {{ $plan ? $plan->descripcion : 'Acceso a los contenidos exclusivos de la plataforma.' }}
            </p>
            <div style="border-top: 1px solid #EAE2D6; padding-top: 15px;">
                <p style="color: #87786E; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: bold;">
                    Habilitado hasta:
                </p>
                <p style="color: #1A1412; font-size: 16px; font-weight: bold; margin: 0;">
                    {{ $fechaVencimiento }}
                </p>
            </div>
        </div>

        <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}" 
           style="background-color: #384230; color: #FAF7F2; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            ¡Empezar a entrenar!
        </a>

        <p style="color: #87786E; font-size: 12px; margin-top: 40px;">
            {{ env('FRONTEND_URL', 'http://localhost:5173') }}
        </p>
    </div>

</body>
</html>