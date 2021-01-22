import React from 'react'
import lodash from 'lodash'
import { useServiceProviders } from '../context/service_provider_context/service_provider_context'

export const useSubdomainUniqueness = () => {
  const { engagementService } = useServiceProviders()
  const [isUnique, setIsUnique] = React.useState<boolean | undefined>(true)
  const [loading, setLoading] = React.useState<boolean>(false)
  const checkSubdomain = lodash.debounce(async (subdomain: string) => {
    setLoading(true)
    try {
      const result = await engagementService.checkSubdomainUniqueness(subdomain)
      setIsUnique(result)
    } catch (e) {
      setIsUnique(false)
    } finally {
      setLoading(false)
    }
  }, 1000)

  return { isUnique, checkSubdomain, loading }
}