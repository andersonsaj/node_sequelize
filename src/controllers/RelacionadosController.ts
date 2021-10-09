import { Request, Response } from "express";
import { Op } from "sequelize";
import * as yup from 'yup';
import AppError from "../errors/AppError";
import { validarData, validarNumero } from "../utils/AppUtils";
import moment from "moment";
import { database } from "../database";
import Relacionados from "../models/Relacionados";

export default class RelacionadosController{

  async create(request: Request, response: Response){
    let {
      data,
      dia,
      valor,
      taxa,
      premio,
      lucro,
      eventoid,
      porcentagem,
      despesas,
      discriminacao
    } = request.body;

    const schema = yup.object().shape({
      dia         : yup.string().required(),
      valor       : yup.number().required(),
      taxa        : yup.number().required(),
      premio      : yup.number().required(),
      lucro       : yup.number().required(),
      eventoid    : yup.number().required(),
      porcentagem : yup.number().required(),
      despesas    : yup.number().required(),
      discriminacao: yup.string().required()
    });

    try {
      await schema.validate(request.body, {abortEarly : false})
    } catch (error) {
      throw new AppError(error);
    }

    if(data){
      if(!validarData(data)){
        throw new AppError('Data inválida!');
      }
    }

   const relacionados = await database.transaction(async transaction => {
   const relacionado = await Relacionados.create({
      data,
      dia,
      valor,
      taxa,
      premio,
      lucro,
      EventoId: eventoid,
      porcentagem,
      despesas,
      discriminacao
    }, {transaction});

    return relacionado;
  });

    return response.status(201).json(relacionados);

  }

  async show(request: Request, response: Response) {
    const {id} = request.query;

    if(!id){
      const all = await Relacionados.findAll();

      return response.json(all);

    }else{
      if(!validarNumero(id)){
        throw new AppError('Valor inválido! O "id" tem que ser um número!');
      }

      const eventoRelacionado = await Relacionados.findOne({where: {id}});

      if(!eventoRelacionado){
        throw new AppError('Não foi encontrado esse registro!');
      }

      return response.json(eventoRelacionado);
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
      dataInicial = moment(String(dataInicial), 'DD/MM/YYYY','pt').format('YYYY/MM/DD');
    }

    if(formatoPtBRFinal.isValid()){
      dataFinal = moment(String(dataFinal), 'DD/MM/YYYY','pt').format('YYYY/MM/DD');
    }

    const dtInicial = new Date(String(dataInicial));
    const dtFinal = new Date(String(dataFinal));

    const eventoRelacionados = await Relacionados.findAll({
      where:{
        data: {
          [Op.between]: 
          [dtInicial, dtFinal]
        }
      }
    });

    return response.json(eventoRelacionados);
  }

  async delete(request: Request, response: Response){
    const {id} = request.params;

    if(!validarNumero(id)){
      throw new AppError('Valor inválido! O "id" tem que ser um número!');
    }

    const relacionado = await Relacionados.findOne({where:{id}});

    if (!relacionado){
      throw new AppError('Não foi encontrado esse registro!');
    }

    await Relacionados.destroy({where:{id}});

    return response.status(204).send();
  }

  async update(request: Request, response: Response){
    const {id} = request.params;

    if(!validarNumero(id)){
      throw new AppError('Valor inválido! O "id" tem que ser um número!');
    }

    const {
      data,
      dia,
      valor,
      taxa,
      premio,
      lucro,
      eventoid,
      porcentagem,
      despesas,
      discriminacao
    } = request.body;

    const schema = yup.object().shape({
      dia         : yup.string().required(),
      valor       : yup.number().required(),
      taxa        : yup.number().required(),
      premio      : yup.number().required(),
      lucro       : yup.number().required(),
      eventoid    : yup.number().required(),
      porcentagem : yup.number().required(),
      despesas    : yup.number().required(),
      discriminacao: yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    const evento = await Relacionados.findOne({where:{id}});

  if (!evento) {
    throw new AppError('Não foi encontrado esse evento!');
  }

  if(data){
    if(!validarData(data)){
      throw new AppError('Data inválida!');
    }
    evento.data = data;
  }

  evento.dia = dia.toUpperCase();
  evento.valor = valor;
  evento.premio = premio;
  evento.taxa = taxa;
  evento.lucro = lucro;
  evento.EventoId = eventoid;
  evento.porcentagem = porcentagem;
  evento.despesas = despesas;
  evento.discriminacao = discriminacao.toUpperCase();

  await Relacionados.update(evento, {
    where:{
      id
    }
  });

  return response.json(evento);
  }    
}