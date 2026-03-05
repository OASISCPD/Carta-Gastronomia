import dotenv from 'dotenv';
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} is required`);
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || '3000'),
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: Number(process.env.DB_PORT || '3306'),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || '10'),
  },
  db2: {
    host: required('DB2_HOST'),
    user: required('DB2_USER'),
    password: required('DB2_PASSWORD'),
    database: process.env.DB2_DATABASE || 'api_etl_workia',
    port: Number(process.env.DB2_PORT || '3306'),
    connectionLimit: Number(process.env.DB2_CONNECTION_LIMIT || '10'),
  },
  jwtSecret: process.env.JWT_SECRET || required('JWT_SECRET'),
};
