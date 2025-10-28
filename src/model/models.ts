export interface SignUpModel {
  email: string;
  senha: string;
  nome: string;
}

export interface SignInModel {
  email: string;
  senha: string;
}

export interface OperationModel {
  tipo: string;
  investidorId: string;
 papel: string | null;
quantidade: number | null;
  valor: number;
}
export interface ativeModel {
  id:string;
  investidorId: string;
  papel: string | null;
  quantidade: number | null;
  valor?: number;
  valorAquisicao:number;
}
export interface InvestidorModel {
  id: string;
  nome: string;
  email: string;
  senha: string; 
  saldo: number;
  patrimonio: number;
  createdAt: Date;
  ativos: ativeModel[];
  transacoes: OperationModel[];
}