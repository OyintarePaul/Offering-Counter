export const routes = {
	services: () => `/` as const,
	offerings: (serviceId: string | number) =>
		`/services/${serviceId}/offerings` as const,
	report: (serviceId: string | number) =>
		`/services/${serviceId}/report` as const,
	serviceEntries: (serviceId: string | number, offeringsId: string | number) =>
		`/services/${serviceId}/offerings/${offeringsId}` as const,
};
