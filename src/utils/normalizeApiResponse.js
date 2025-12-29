export const normalizeApiResponse = (key, response) => {
  if (!response) return null;

  const raw = response.data;

  switch (key) {
    case "hero":
      // hero sometimes: data, data[0]
      return raw?.data?.[0] || raw?.data || raw || null;

    case "about":
      return raw?.data?.[0] || raw?.data || raw || null;

    case "products":
      // must be array
      return Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
        ? raw.data.data
        : [];

    case "services":
      return Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.data)
        ? raw.data.data
        : [];

    default:
      return raw?.data || raw || null;
  }
};
