<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Procedimiento para actualizar membresías basado en fecha_vencimiento
        DB::unprepared("
            CREATE OR REPLACE PROCEDURE sp_actualizar_membresias()
            LANGUAGE plpgsql
            AS $$
            BEGIN
                -- Si la fecha de vencimiento es menor a HOY, se da de baja.
                UPDATE usuario
                SET estado = 'Baja'
                WHERE estado = 'Activa' AND fecha_vencimiento < CURRENT_DATE;
            END;
            $$;
        ");

        // 2. Función para obtener las métricas del dashboard
        DB::unprepared("
            CREATE OR REPLACE FUNCTION fn_obtener_resumen_dashboard()
            RETURNS json
            LANGUAGE plpgsql
            AS $$
            DECLARE
                res_metricas json;
                res_video json;
                res_distribucion json;
            BEGIN
                -- MÉTRICAS GLOBALES
                SELECT json_build_object(
                    'alumnasActivas', (SELECT COUNT(*) FROM usuario WHERE estado = 'Activa'),
                    'alumnasInactivas', (SELECT COUNT(*) FROM usuario WHERE estado = 'Baja'),
                    'videosActivos', (SELECT COUNT(*) FROM ejercicio WHERE activo = true),
                    'videosOcultos', (SELECT COUNT(*) FROM ejercicio WHERE activo = false),
                    'planesVisibles', (SELECT COUNT(*) FROM nivel_membresia WHERE activo = true),
                    'guardadosTotales', (SELECT COUNT(*) FROM ejercicio_favorito)
                ) INTO res_metricas;

                -- VIDEO MÁS GUARDADO
                SELECT json_build_object(
                    'videoTitulo', e.titulo,
                    -- Tomamos la primera categoría asignada para el resumen
                    'disciplina', (
                        SELECT c.titulo 
                        FROM categoria c 
                        INNER JOIN categoria_ejercicio ce ON c.id_categoria = ce.id_categoria 
                        WHERE ce.id_ejercicio = e.id_ejercicio 
                        LIMIT 1
                    ),
                    'cantidadGuardados', COUNT(ef.id_ejercicio)
                ) INTO res_video
                FROM ejercicio_favorito ef
                INNER JOIN ejercicio e ON ef.id_ejercicio = e.id_ejercicio
                GROUP BY e.id_ejercicio, e.titulo
                ORDER BY COUNT(ef.id_ejercicio) DESC
                LIMIT 1;

                -- DISTRIBUCIÓN POR PLAN (Nivel Membresía)
                SELECT json_agg(
                    json_build_object(
                        'planTitulo', nm.descripcion,
                        'cantidadAlumnas', COALESCE(alumnas_count.total, 0)
                    )
                ) INTO res_distribucion
                FROM nivel_membresia nm
                LEFT JOIN (
                    SELECT id_nivel, COUNT(*) as total 
                    FROM usuario 
                    WHERE estado = 'Activa' 
                    GROUP BY id_nivel
                ) alumnas_count ON nm.id_nivel = alumnas_count.id_nivel;

                -- RETORNO DEL JSON ESTRUCTURADO
                RETURN json_build_object(
                    'metricas', res_metricas,
                    'videoDestacado', res_video,
                    'distribucion', COALESCE(res_distribucion, '[]'::json)
                );
            END;
            $$;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_actualizar_membresias();");
        DB::unprepared("DROP FUNCTION IF EXISTS fn_obtener_resumen_dashboard();");
    }
};