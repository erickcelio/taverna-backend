export const loadResolver = async type => {
  try {
    const resolver = await import(`./../types/${type}/${type}.resolvers.js`)
    return resolver.default
  } catch (e) {
    return {}
  }
}
