<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recuperar Contraseña</title>
</head>
<body style="background-color: #FAF7F2; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; margin: 0;">
    
    <div style="background-color: #ffffff; max-width: 500px; margin: 0 auto; border-radius: 24px; padding: 40px; border: 1px solid #EAE2D6; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <div style="width: 64px; height: 64px; background-color: #384230; color: #FAF7F2; border-radius: 50%; font-size: 24px; font-weight: bold; line-height: 64px; margin: 0 auto 20px auto;">
            V
        </div>

        <h1 style="color: #1A1412; font-size: 22px; margin-bottom: 15px;">Recuperación de contraseña</h1>
        
        <p style="color: #5C524B; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón inferior para crear una nueva.<br><br>
            <strong style="color: #D97777;">Este enlace es seguro y expirará en 1 hora.</strong>
        </p>

        <a href="{{ $urlRecuperacion }}" 
           style="background-color: #384230; color: #FAF7F2; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            Crear nueva contraseña
        </a>

        <p style="color: #87786E; font-size: 12px; margin-top: 40px; line-height: 1.5;">
            Si no solicitaste este cambio, ignora este correo y tu cuenta seguirá segura.<br><br>
            Enlace alternativo: <br>
            <a href="{{ $urlRecuperacion }}" style="color: #384230; word-break: break-all;">{{ $urlRecuperacion }}</a>
        </p>
    </div>

</body>
</html>