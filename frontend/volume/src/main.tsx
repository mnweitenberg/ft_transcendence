import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/style.css";

const link = createHttpLink({
	uri: "http://localhost:4242/graphql",
	credentials: "include",
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ApolloProvider>
	</React.StrictMode>
);
