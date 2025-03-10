export default function Home() {
  return (
    <div className="container-6 mt-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-3/4 justify-self-center">
        <div>
          <h1 className="font-bold text-2xl text-center bg-table-header border border-accent-alternate rounded-t-lg">
            Container
          </h1>
          <div className="p-2 border border-accent-alternate border-t-0">
            Content
          </div>
        </div>
        <div>
          <h1 className="font-bold text-2xl text-center bg-table-header border border-accent-alternate rounded-t-lg">
            Item
          </h1>
          <div className="p-2 border border-accent-alternate border-t-0">
            Content
          </div>
        </div>
      </div>
    </div>
  );
}
