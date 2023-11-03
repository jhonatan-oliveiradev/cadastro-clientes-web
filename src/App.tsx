import { useState, useEffect, useRef, FormEvent } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";

interface CustomerProps {
	id: string;
	name: string;
	email: string;
	status: string;
	created_at: string;
}

export default function App() {
	const [customers, setCustomers] = useState<CustomerProps[]>([]);
	const nameRef = useRef<HTMLInputElement | null>(null);
	const emailRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		loadCustomers();
	}, []);

	async function loadCustomers() {
		const response = await api.get("/customers");
		setCustomers(response.data);
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const name = nameRef.current?.value;
		const email = emailRef.current?.value;

		if (!name || !email) {
			return alert("Preencha todos os campos!");
		}

		const response = await api.post("/customer", {
			name,
			email
		});

		setCustomers([...customers, response.data]);
	}

	async function handleDelete(id: string) {
		try {
			await api.delete("/customer", {
				params: {
					id
				}
			});
		} catch (err) {
			alert("Erro ao deletar cliente!");
		}

		const newCustomersList = customers.filter((customer) => customer.id !== id);

		setCustomers(newCustomersList);
	}

	return (
		<div className="w-full flex justify-center min-h-screen bg-zinc-900">
			<main className="my-10 w-full md:max-w-2xl">
				<h1 className="text-4xl font-medium text-zinc-50">Clientes</h1>

				<form className="flex flex-col my-6" onSubmit={handleSubmit}>
					<label className="font-medium text-zinc-50">Nome:</label>
					<input
						ref={nameRef}
						type="text"
						className="w-full rounded p-2 my-2"
						placeholder="Nome do cliente"
					/>

					<label className="font-medium text-zinc-50">E-mail:</label>
					<input
						ref={emailRef}
						type="email"
						className="w-full rounded p-2 my-2"
						placeholder="E-mail do cliente"
					/>

					<input
						type="submit"
						className="bg-emerald-500 hover:bg-emerald-400 transition-all text-zinc-50 font-bold rounded p-2 my-2 cursor-pointer"
						value="Cadastrar"
					/>
				</form>

				<section className="flex flex-col">
					{customers.map((customer) => (
						<article
							key={customer.id}
							className="w-full bg-zinc-50 rounded p-2 relative hover:scale-105 duration-200 my-2"
						>
							<p>
								<span className="font-medium">Nome:</span> {customer.name}
							</p>
							<p>
								<span className="font-medium">E-mail:</span> {customer.email}
							</p>
							<p>
								<span className="font-medium">Status:</span>{" "}
								{customer.status ? "ATIVO" : "INATIVO"}
							</p>

							<button
								onClick={() => handleDelete(customer.id)}
								className="bg-red-500 w-7 h-7 flex items-center absolute rounded-lg right-0 md:-right-2 -top-2 justify-center"
							>
								<FiTrash size={18} color="#fff" />
							</button>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}
