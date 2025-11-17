export function universalSearch(data, query, keys) {
  if (!query || query.trim() === "") return data;

  const lower = query.toLowerCase();

  return data.filter((item) =>
    keys.some((key) => item[key]?.toString().toLowerCase().includes(lower))
  );
}
