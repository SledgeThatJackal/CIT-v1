import { CellContext } from "@tanstack/react-table";
import Image from "next/image";

export default function ImageCell<T, S>(context: CellContext<T, S>) {
  return <Image src="temp" alt="Image" />;
}
