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
  papel?: string;
  quantidade?: number;
  valor: number;
}