import BaseModel from "../models/BaseModel";

function firebaseConverter<T extends BaseModel>(
    ModelClass: new () => T
): any {

    function toFirestore(value: T): any {
        console.log("CONVERTER: Entrou no toFirestore");

        const dados = value.toFirestore();

        console.log("CONVERTER: Dados:", dados);

        return dados;
    }

    function fromFirestore(snapshot: any, options: any): T {
        return new ModelClass().fromFirestore(snapshot, options) as T;
    }

    return { toFirestore, fromFirestore };
}

export default firebaseConverter;