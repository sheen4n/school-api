## To Initialize Sequelize

npx sequelize init --force

## Change Config to

"development": {
"username": "root",
"password": "Pine@pple1",
"database": "database_school_development",
"host": "127.0.0.1",
"dialect": "mysql",
"operatorsAliases": 0
},

## Create Model With

npx sequelize model:create --name Teacher --attributes email:string

npx sequelize-cli model:generate --name Student --attributes email:string,suspended:boolean

npx sequelize-cli model:generate --name Registration --attributes teacherId:integer,studentId:integer

## Add Association

Student.associate = function (models) {
Student.hasMany(models.Registration, { foreignKey: 'id', targetKey: 'studentId' });
};

Teacher.associate = function (models) {
Teacher.hasMany(models.Registration, { foreignKey: 'id', targetKey: 'teacherId' });
};

Registration.associate = function (models) {
Registration.belongsTo(models.Student, { foreignKey: 'studentId', targetKey: 'id' });
Registration.belongsTo(models.Teacher, { foreignKey: 'teacherId', targetKey: 'id' });
};

## Change Model Columns

const Teacher = sequelize.define(
'Teacher',
{
id: {
allowNull: false,
autoIncrement: true,
primaryKey: true,
type: DataTypes.INTEGER,
},
email: { type: DataTypes.STRING, unique: true },
},
{},
);

const Student = sequelize.define(
'Student',
{
id: {
allowNull: false,
autoIncrement: true,
primaryKey: true,
type: DataTypes.INTEGER,
},
email: { type: DataTypes.STRING, unique: true },
suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
},
{},
);

const Registration = sequelize.define(
'Registration',
{
teacherId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
studentId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
},
{},
);
Registration.removeAttribute('id');

## Run the sync Script

const db = require('./models');
db.sequelize.sync();

## Seed the Data

\seeders\articles.js
\seeders\boxes.js
