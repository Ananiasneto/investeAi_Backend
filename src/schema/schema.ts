import Joi from "joi";

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
});

export const signUpSchema = Joi.object({
  nome: Joi.string().required(),  
  email: Joi.string().email().required(), 
  senha: Joi.string().min(6).required(), 
});

export const operationSchema = Joi.object({
  tipo: Joi.string()
    .uppercase()
    .valid("APORTE", "COMPRA", "VENDA")
    .required(),
  investidorId: Joi.string().required(),
  papel: Joi.when("tipo", {
    is: Joi.valid("COMPRA", "VENDA"),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  quantidade: Joi.when("tipo", {
    is: Joi.valid("COMPRA", "VENDA"),
    then: Joi.number().integer().positive().max(1000).required(),
    otherwise: Joi.forbidden(),
  }),
  valor: Joi.when("tipo", {
    is: "APORTE",
    then: Joi.number().positive().max(10000).required(),
    otherwise: Joi.forbidden(),
  }),
});