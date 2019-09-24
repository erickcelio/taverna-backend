export const loadResolver = async type => {
  const resolver = await import(`./../types/${type}/${type}.resolvers.js`)

  return resolver.default
}
