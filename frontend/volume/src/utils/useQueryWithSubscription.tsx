import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";

export function useQueryWithSubscription(query: any, subscription: any) {
	const [data, setData] = useState([]);
	const { data: queryData, loading: queryLoading, error: queryError } = useQuery(query);
	const { data: subscriptionData } = useSubscription(subscription);

	useEffect(() => {
		if (queryData) setData(queryData.getInitialRanking);
	}, [queryData]);

	useEffect(() => {
		if (subscriptionData) setData(subscriptionData.rankingHasBeenUpdated);
	}, [subscriptionData]);

	return { data, loading: queryLoading, error: queryError };
}
