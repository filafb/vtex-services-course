export const productList = async (
  _: any,
  { topN }: { topN: number },
  { clients: { masterdata } }: Context
) => {
  const { data } = await masterdata.scrollDocuments({
    dataEntity: "ZZ",
    fields: ["count", "slug"],
    schema: "v1",
    size: topN,
    sort: `count DESC`,
  });
  return data
};
