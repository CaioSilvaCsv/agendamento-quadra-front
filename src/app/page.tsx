import { redirect } from "next/navigation";
//Quando acessado a rota raiz, redireciona para a página de quadras.
export default function Home() {
redirect("quadras");
}