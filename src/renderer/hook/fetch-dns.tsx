import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { UrlsConstant } from '../../shared/constants/urls.constant'
import type { Server } from '../../shared/interfaces/server.interface'

export function useGetDnsList() {
	return useQuery({
		queryKey: ['fetch-dns-list'],
		queryFn: async () => {
			try {
				const response = await axios.get<Server[]>(UrlsConstant.STORE, {
					timeout: 8000,
				})
				return response.data
			} catch (err) {
				const response = await axios.get<Server[]>(UrlsConstant.STORE_SERVER, {
					timeout: 8000,
				})
				return response.data
			}
		},
		gcTime: 1000 * 60 * 5, // 5 minutes
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: 2,
		retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
		refetchOnWindowFocus: false,
		placeholderData: (previousData) => previousData,
	})
}
