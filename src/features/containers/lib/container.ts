export async function fetchOrphanContainers(id: string, isArea: boolean) {
  const res = await fetch(`/api/container/orphans?id=${id}&isArea=${isArea}`, {
    method: "GET",
  });

  return await res.json();
}
