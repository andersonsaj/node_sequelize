import { database } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

interface IRelacionado {
  id: number;
  data: Date;
  dia: string;
  valor: number;
  taxa: number;
  premio: number;
  lucro: number;
  EventoId: number;
  porcentagem: number;
  despesas: number;
  discriminacao: string;
}
interface IRelacionadoOptional extends Optional<IRelacionado, "id"> {}

class Relacionados extends Model<IRelacionado, IRelacionadoOptional> implements IRelacionado {
  id: number;
  data: Date;
  dia: string;
  valor: number;
  taxa: number;
  premio: number;
  lucro: number;
  EventoId: number;
  porcentagem: number;
  despesas: number;
  discriminacao: string;
}

Relacionados.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.DATE
  },
  EventoId: {
    type: DataTypes.INTEGER,
    field: "eventoid",
    allowNull: false,
    references: {
      model: 'Evento',
      key: 'id'
    }
  },
  dia: {
    type: DataTypes.STRING
  },
  valor: {
    type: DataTypes.DOUBLE
  },
  taxa: {
    type: DataTypes.DOUBLE
  },
  premio: {
    type: DataTypes.DOUBLE
  },
  lucro: {
    type: DataTypes.DOUBLE
  },
  porcentagem: {
    type: DataTypes.DOUBLE
  },
  despesas: {
    type: DataTypes.DOUBLE
  },
  discriminacao: {
    type: DataTypes.STRING
  }
},{
  sequelize: database,
  tableName: 'eventorelacionados'
});

export default Relacionados;
