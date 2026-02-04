// Script para verificar registros con porcentajes altos
import { pool } from '../src/config/db';

async function verifyPercentages() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        id, articulo, pct_ganancia_final, fecha_actualizacion_costo
      FROM articulos 
      WHERE pct_ganancia_final > 999
      ORDER BY pct_ganancia_final DESC
      LIMIT 10
    `);
    
    console.log('🔍 Artículos con % de ganancia > 999:');
    console.log('━'.repeat(80));
    rows.forEach((row: any) => {
      console.log(`ID: ${row.id}`);
      console.log(`  Artículo: ${row.articulo}`);
      console.log(`  % Ganancia Final: ${row.pct_ganancia_final}%`);
      console.log(`  Fecha Actualización Costo: ${row.fecha_actualizacion_costo || 'N/A'}`);
      console.log('━'.repeat(80));
    });
    
    const [count]: any = await pool.query(`
      SELECT COUNT(*) as total FROM articulos WHERE pct_ganancia_final IS NOT NULL
    `);
    
    console.log(`\n✅ Total artículos con % ganancia: ${count[0].total}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  }
}

verifyPercentages();
