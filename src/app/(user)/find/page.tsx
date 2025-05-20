import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingLabel from "@/components/ui/custom/floating-label";
import Image from "next/image";

export default async function FindPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex mb-2">
            <span>Image Search</span>
            <span className="ms-auto">{`Displaying {} out of {} images`}</span>
          </CardTitle>
          <SearchBar />
          <CardContent className="grid grid-cols-14 p-0">
            <div className="bg-table-header p-2 rounded-xl text-center">
              <p>Barcode ID</p>
              <Image
                src="/uploads/images/darkstar zed.jpg"
                alt="Random Image"
                width={50}
                height={50}
              />
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

function SearchBar() {
  return (
    <fieldset className="flex flex-row">
      <FloatingLabel
        id="find-search-containerName"
        label="Container Name"
        className="rounded-l-lg"
      />
      <FloatingLabel id="find-search-barcodeId" label="Barcode ID" />
      <FloatingLabel id="find-search-itemName" label="Item Name" />
      <Button
        className="rounded-none rounded-r-lg hover:cursor-pointer h-11"
        variant="secondary"
      >
        Search
      </Button>
    </fieldset>
  );
}
