import AppError from "../errors/AppError";

export function validarData(data: any) : boolean{
    if(data.length < 10){
        throw new AppError('Data inválida!');
    }

    let dateParse = Date.parse(data);

    if (isNaN(dateParse)){
        data = data.substr(6,9) + data.substr(2,4) + data.substr(0,2);

        dateParse = Date.parse(data);

        if(isNaN(dateParse)){
            return false;
        }
    }
    return true;
}

export function validarNumero(numero): boolean{
    let verificar = Number(numero);

     if (isNaN(verificar)){
         return false;
     }
     
    return true;
}