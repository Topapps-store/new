import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';

/**
 * Añade una aplicación desde Google Play Store
 * @param req Request con la URL de Google Play
 * @param res Response
 */
export const addAppFromPlayStore = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Se requiere una URL de Google Play.' });
    }
    
    if (!url.includes('play.google.com')) {
      return res.status(400).json({ message: 'La URL debe ser de Google Play Store.' });
    }
    
    // Ruta al script que procesa las URLs de Google Play
    const scriptPath = path.resolve(__dirname, '../../tools/playstore-scraper.js');
    
    // Ejecutar el script como un proceso secundario
    exec(`node ${scriptPath} "${url}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando el script: ${error.message}`);
        console.error(`Error detallado: ${stderr}`);
        return res.status(500).json({ 
          message: 'Error al procesar la aplicación.', 
          error: error.message,
          details: stderr
        });
      }
      
      console.log(`Salida del script: ${stdout}`);
      
      // Si el script fue exitoso, enviar respuesta positiva
      if (stdout.includes('Proceso completado exitosamente') || 
          stdout.includes('Se añadieron')) {
        return res.status(200).json({ 
          message: 'Aplicación añadida exitosamente.', 
          details: stdout 
        });
      } else if (stdout.includes('No hay nuevas apps para añadir')) {
        return res.status(200).json({ 
          message: 'La aplicación ya existe en la base de datos.', 
          details: stdout 
        });
      } else {
        return res.status(500).json({ 
          message: 'No se pudo procesar la aplicación correctamente.', 
          details: stdout 
        });
      }
    });
  } catch (error: any) {
    console.error('Error en el controlador:', error);
    return res.status(500).json({ 
      message: 'Error del servidor al procesar la solicitud.', 
      error: error.message 
    });
  }
};