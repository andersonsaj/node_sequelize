import { database } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import Relacionados from "./Relacionados";

interface IEvento {
  id: number;
  descricao: string;
  categoria: string;
  premio: number;
  lucro: number;
  datacriacao: Date;
}
interface IEventoOptional extends Optional<IEvento, "id"> {}

class Evento extends Model<IEvento, IEventoOptional> implements IEvento{
  id: number;
  descricao: string;
  categoria: string;
  premio: number;
  lucro: number;
  datacriacao: Date;
}


Evento.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: { 
      type: DataTypes.STRING
    },
      categoria: {
        type: DataTypes.STRING 
    },
    datacriacao: {
      type: DataTypes.DATE
    },
      premio: {
        type: DataTypes.DOUBLE
    },
      lucro: {
       type: DataTypes.DOUBLE
    },
  },
  {
    sequelize: database,
    tableName: "evento",
  });

  Evento.hasMany(Relacionados, {
        foreignKey:{
            field: 'eventoid',
        }
    });

    export default Evento;