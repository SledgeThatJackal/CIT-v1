import { CellContext } from "@tanstack/react-table";
import Image from "next/image";

export default function ImageCell<T, S>(context: CellContext<T, S>) {
  return <div>Image</div>;
}
//<Image src="temp" alt="Image" width="50" height="50" />
