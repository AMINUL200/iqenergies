export const normalizeApiResponse = (key, response) => {
  if (!response) return null;

  const raw = response.data;

  switch (key) {
    case "hero":
      // hero sometimes: data, data[0]
      return raw?.data || null;

    case "about":
      return raw?.data?.hero || null;

    case "whatWeDo":
      return raw?.data || null;

    case "solution":
      return raw?.data || null;

    default:
      return raw?.data || raw || null;
  }
};
