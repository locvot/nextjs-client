import indicatorApiRequest from '@/apiRequests/indicator'
import { DashboardIndicatorQueryParamsType } from '@/schemaValidations/indicator.schema'
import { useQuery } from '@tanstack/react-query'

export const useDashboardIndicaotr = (queryParms: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParms),
    queryKey: ['dashboardIndicators', queryParms]
  })
}
