import { addDoc, collection, CollectionReference, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, WhereFilterOp } from "firebase/firestore";
import BaseModel from "../models/BaseModel";
import firebaseConverter from "../converters/firebaseConverter";
import { db } from "../../firebase-init";

export abstract class BaseRepository<T extends BaseModel> {
    private collectionRef: CollectionReference;

    constructor(collectionName: string, ModelClass: new () => T) {
        const converter = firebaseConverter<T>(ModelClass)
        this.collectionRef = collection(db, collectionName).withConverter(converter)
    }

    // Promise é uma promessa de que vai retornar algo no futuro
    // aqui ele vai retornar T
    async salvar(entidade: T): Promise<T> {
    try {
        console.log("SALVAR 1: Entrou no repository");

        const docRef = doc(this.collectionRef, entidade.getId());

        console.log("SALVAR 2: Chamando setDoc");

        await setDoc(docRef, entidade);

        console.log("SALVAR 3: setDoc finalizado!");

        return entidade;

    } catch (error) {
        console.error("ERRO NO REPOSITORY:", error);
        throw error;
    }
}

    async listarTodos(): Promise<T[]> {
        const snapshot = await getDocs(this.collectionRef)
        return snapshot.docs.map(doc => doc.data()) as T[]
    }

    async deletar(id: string): Promise<void> {
        const docRef = doc(this.collectionRef, id)
        return deleteDoc(docRef)

    }

    async buscarId(id: string): Promise<T | null> {
        const docRef = doc(this.collectionRef, id)
        const snapshot = await getDoc(docRef)
        return snapshot.exists() ? snapshot.data() as T : null

    }

    async buscarPorCampo(campo: string, operador: WhereFilterOp, valor: any): Promise<T[]> {
        const q = query(this.collectionRef, where(campo, operador, valor));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data()) as T[];
    }

}