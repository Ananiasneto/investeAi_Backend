import axios from "axios";

export async function getPreco(papel: string): Promise<number> {
  try {
    const resposta = await axios.get(`https://brapi.dev/api/quote/${papel}`);
    const valor = resposta.data?.results?.[0];
    if (!valor) throw new Error("Papel não encontrado na Brapi");
    return valor.regularMarketPrice;
  } catch (err) {
    console.error("Erro ao buscar cotação na Brapi:", err);
    throw new Error("Erro ao consultar preço do papel");
  }
}
