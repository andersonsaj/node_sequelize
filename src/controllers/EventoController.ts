import { Request, Response } from "express";
import { validarData, validarNumero } from "../utils/AppUtils";
import * as yup from 'yup';
import AppError from "../errors/AppError";
import { Op} from "sequelize";
import moment from "moment";
import { database } from "../database";
import Evento from "../models/Evento";

export default class EventoController {
    async create(request: Request, response: Response) {
      const {
        descricao,
        categoria,
        premio,
        lucro,
        datacriacao } = request.body;

      const schema = yup.object().shape({
        descricao: yup.string().required(),
        categoria: yup.string().required(),
        premio:    yup.number().required(),
        lucro:     yup.number().required()
      });

      try {
        await schema.validate(request.body, { abortEarly: false });
      } catch (err) {
        throw new AppError(err);
      }

      if(datacriacao){
        if(!validarData(datacriacao)){
          throw new AppError('Data inválida!');
        }
      }

      const evento = await database.transaction(async transaction => {
      const evento = await Evento.create({
        descricao: descricao.toUpperCase(),
        categoria: categoria.toUpperCase(),
        premio,
        lucro,
        datacriacao
      });

      return evento
    
    });

      return response.status(201).json(evento);
    }

    async show(request: Request, response: Response) {
      const {id} = request.query;

      if(!id){
        const all = await Evento.findAll({include: 'Relacionados'});
        
        return response.json(all);

      }else{
        if(!validarNumero(id)){
          throw new AppError('Valor inválido! O "id" tem que ser um número!');
        }

        const evento = await Evento.findOne({
           include: 'Relacionados' ,
          where: {
            id
          }
        });

        if(!evento){
          throw new AppError('Não foi encontrado esse evento!');
        }

        return response.json(evento);
      }
    }

    async showPeriodo(request: Request, response: Response) {
      let {dataInicial, dataFinal} = request.query;

      if(!validarData(dataInicial)){
        throw new AppError('Data inválida!');
      }

      if(!validarData(dataFinal)){
        throw new AppError('Data inválida!');
      }

      const formatoPtBRInicial = moment(String(dataInicial), 'DD/MM/YYYY', true);

      const formatoPtBRFinal = moment(String(dataFinal), 'DD/MM/YYYY', true);
  
      if(formatoPtBRInicial.isValid()){
        dataInicial = moment(String(dataInicial), 'YYYY/MM/DD','pt').format('YYYY/MM/DD');
      }
  
      if(formatoPtBRFinal.isValid()){
        dataFinal = moment(String(dataFinal), 'DD/MM/YYYY','pt').format('YYYY/MM/DD');
      }

      const inicial = new Date(String(dataInicial));
      const final = new Date(String(dataFinal));

      const eventos = await Evento.findAll({
        include: 'Relacionados',
        where:{
          datacriacao: {
            [Op.between]: 
            [inicial, final]
          },
        }
      });

      return response.json(eventos);
    }

    async delete(request: Request, response: Response){
      const {id} = request.params;

      if(!validarNumero(id)){
        throw new AppError('Valor inválido! O "id" tem que ser um número!');
      }

      const evento = await Evento.findOne({ where :{id}});

      if (!evento){
        throw new AppError('Não foi encontrado esse evento!');
      }

      await Evento.destroy({where:{id}});

      return response.status(204).send();
    }

    async update(request: Request, response: Response){
      const {id} = request.params

      if(!validarNumero(id)){
        throw new AppError('Valor inválido! O "id" tem que ser um número!');
      }

      const {
        descricao,
        categoria,
        premio,
        lucro } = request.body;

      const schema = yup.object().shape({
        descricao: yup.string().required(),
        categoria: yup.string().required(),
        premio:    yup.number().required(),
        lucro:     yup.number().required()
      });

      try {
        await schema.validate(request.body, { abortEarly: false });
      } catch (err) {
        throw new AppError(err);
      }
      const evento = await Evento.findOne({where:{id}});

    if (!evento) {
      throw new AppError('Não foi encontrado esse evento!');
    }
      evento.descricao = descricao.toUpperCase();
      evento.categoria = categoria.toUpperCase();
      evento.premio = premio;
      evento.lucro = lucro;

    await Evento.update(evento, {
      where: {
        id
      }
    });

    return response.json(evento);
    }    
}
