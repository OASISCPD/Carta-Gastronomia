// Script para ejecutar la migración de columnas de porcentaje
import { pool } from '../src/config/db';

async function alterPercentageColumns() {
  try {
    console.log('🔧 Modificando columnas de porcentaje para soportar valores mayores...');
    
    const sql = `
      ALTER TABLE articulos 
        MODIFY COLUMN pct_ganancia_pretendida DECIMAL(7, 2) DEFAULT NULL,
        MODIFY COLUMN pct_ganancia_final DECIMAL(7, 2) DEFAULT NULL;
    `;
    
    await pool.query(sql);
    
    console.log('✅ Columnas modificadas exitosamente');
    console.log('   - pct_ganancia_pretendida: DECIMAL(7,2) - soporta hasta 99999.99%');
    console.log('   - pct_ganancia_final: DECIMAL(7,2) - soporta hasta 99999.99%');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error al modificar columnas:', error.message || error);
    process.exit(1);
  }
}

alterPercentageColumns();
