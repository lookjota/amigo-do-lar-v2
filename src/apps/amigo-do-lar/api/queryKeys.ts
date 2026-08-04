export const queryKeys = {
  services: ['services'] as const,
  service: (slug: string) => ['services', slug] as const,
  serviceAreas: ['service-areas'] as const,
  authenticatedUser: ['authenticated-user'] as const,
}
