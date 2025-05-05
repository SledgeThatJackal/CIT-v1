import { ImageJoinType } from "@/features/images/schema/images";
import { Card, CardContent } from "../ui/card";
import DetailArea, { DetailField } from "../ui/custom/detail-area";
import { ImageCarousel } from "./DetailSections";

export default function DetailTabContent<T>({
  data,
  fields,
  images,
}: {
  data: T;
  fields: DetailField<T>[];
  images?: ImageJoinType[];
}) {
  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <DetailArea data={data} fields={fields} />
        </div>
        <ImageCarousel images={images} />
      </CardContent>
    </Card>
  );
}
