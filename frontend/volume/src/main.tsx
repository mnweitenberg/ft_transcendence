import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/style.css";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({ uri: "http://localhost:4242/graphql", credentials: "include" });

const wsLink = new GraphQLWsLink(createClient({ url: "ws://localhost:4242/graphql" }));

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === "OperationDefinition" && definition.operation === "subscription";
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
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
