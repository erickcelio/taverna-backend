export const loadResolver = async type => {
  try {
    const resolver = await import(`./../resolvers/${type}.js`)
    return resolver.default
  } catch (e) {
    return {}
  }
}
