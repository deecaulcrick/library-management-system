/**
 * Generic database migration utility for SQLite + Sequelize
 * 
 * This script automatically detects and adds missing columns from your models
 * to the database tables. 
 * 
 * Usage: 
 *   node src/migrations/migrate-db.js [modelName]
 * 
 * If modelName is provided, only that model will be migrated.
 * Otherwise, all models will be migrated.
 */

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

// Mapping from Sequelize data types to SQLite column types
const typeMapping = {
  'INTEGER': 'INTEGER',
  'BIGINT': 'INTEGER',
  'FLOAT': 'REAL',
  'DOUBLE': 'REAL',
  'DECIMAL': 'REAL',
  'STRING': 'TEXT',
  'TEXT': 'TEXT',
  'DATE': 'TEXT',
  'DATEONLY': 'TEXT',
  'BOOLEAN': 'INTEGER',
  'ENUM': 'TEXT',
  'JSON': 'TEXT',
  'JSONB': 'TEXT',
  'BLOB': 'BLOB',
  'UUID': 'TEXT',
  'UUIDV4': 'TEXT',
  'ARRAY': 'TEXT', // SQLite doesn't support arrays, store as JSON string
  'CITEXT': 'TEXT',
};

// Load all models
async function loadModels() {
  const modelsDir = path.join(__dirname, '../models');
  const models = {};
  
  // Read model files from the models directory
  const files = fs.readdirSync(modelsDir);
  for (const file of files) {
    if (file.endsWith('.js') && file !== 'index.js') {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath);
      
      // Skip if it's not a proper Sequelize model
      if (!model.tableName || !model.rawAttributes) continue;
      
      models[model.name] = model;
    }
  }
  
  return models;
}

// Get table info from SQLite
async function getTableInfo(tableName) {
  const [results] = await sequelize.query(
    `PRAGMA table_info(${tableName})`
  );
  return results;
}

// Generate ALTER TABLE statement for missing column
function generateAlterTableStatement(tableName, columnName, attribute) {
  let dataType;
  
  // Extract the data type
  const sequelizeType = attribute.type.key || 'STRING';
  dataType = typeMapping[sequelizeType] || 'TEXT';
  
  // Build the column definition
  let columnDefinition = `${columnName} ${dataType}`;
  
  // Add DEFAULT constraint if specified
  if (attribute.defaultValue !== undefined && attribute.defaultValue !== null) {
    // Special handling for boolean default values
    if (typeof attribute.defaultValue === 'boolean') {
      columnDefinition += ` DEFAULT ${attribute.defaultValue ? 1 : 0}`;
    } 
    // Special handling for string default values
    else if (typeof attribute.defaultValue === 'string') {
      columnDefinition += ` DEFAULT '${attribute.defaultValue}'`;
    }
    // Default handling for other types 
    else {
      columnDefinition += ` DEFAULT ${attribute.defaultValue}`;
    }
  }
  
  // Add NOT NULL constraint if required
  if (attribute.allowNull === false) {
    columnDefinition += ' NOT NULL';
  }
  
  // Generate the complete ALTER TABLE statement
  return `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`;
}

// Migrate a specific model
async function migrateModel(model) {
  console.log(`Migrating model: ${model.name}`);
  
  try {
    const tableName = model.tableName;
    const tableInfo = await getTableInfo(tableName);
    
    // Get existing column names
    const existingColumns = tableInfo.map(column => column.name);
    
    // Get model attributes (excluding timestamps if not used)
    const modelAttributes = model.rawAttributes;
    
    // Track missing columns
    const missingColumns = [];
    
    // Check for missing columns
    for (const [columnName, attribute] of Object.entries(modelAttributes)) {
      if (!existingColumns.includes(columnName)) {
        missingColumns.push({ columnName, attribute });
      }
    }
    
    // Add missing columns
    if (missingColumns.length > 0) {
      console.log(`Found ${missingColumns.length} missing columns in ${tableName}`);
      
      for (const { columnName, attribute } of missingColumns) {
        try {
          const alterTableStatement = generateAlterTableStatement(tableName, columnName, attribute);
          console.log(`Adding column: ${columnName}`);
          console.log(`SQL: ${alterTableStatement}`);
          
          await sequelize.query(alterTableStatement);
          console.log(`Successfully added column: ${columnName}`);
        } catch (error) {
          console.error(`Error adding column ${columnName}:`, error.message);
        }
      }
    } else {
      console.log(`No missing columns in ${tableName}`);
    }
    
    return missingColumns.length;
  } catch (error) {
    console.error(`Error migrating model ${model.name}:`, error.message);
    return 0;
  }
}

// Main migration function
async function migrate(specificModelName = null) {
  try {
    console.log('Starting database migration...');
    
    // Load models
    const models = await loadModels();
    
    // Count migrations
    let totalMigrations = 0;
    
    // Migrate specific model if provided, otherwise migrate all
    if (specificModelName) {
      const model = models[specificModelName];
      if (model) {
        totalMigrations += await migrateModel(model);
      } else {
        console.error(`Model "${specificModelName}" not found`);
      }
    } else {
      // Migrate all models
      for (const model of Object.values(models)) {
        totalMigrations += await migrateModel(model);
      }
    }
    
    console.log(`Migration completed: ${totalMigrations} columns added`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Process command line arguments
const modelName = process.argv[2];

// Run migration if this script is executed directly
if (require.main === module) {
  migrate(modelName);
}

module.exports = migrate;
