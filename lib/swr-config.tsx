'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'
import { config } from './config'
import { getFirebaseIdToken } from './firebase-auth'

/**
 * SWR fetcher with authentication
 */
async function swrFetcher(url: string) {
  const token = await getFirebaseIdToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(`${config.api.baseUrl}${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // @ts-ignore
    error.status = response.status
    throw error
  }

  return response.json()
}

/**
 * SWR Configuration Provider
 */
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  )
}
