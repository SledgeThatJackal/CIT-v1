/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ComponentType } from "react";

type RowData = unknown | object | any[];

export type DetailRowData<T, S = T[keyof T] | RowData> = {
  getValue: () => S;
  data: T;
  row: {
    id: keyof T;
  };
};

export type DetailField<T> = {
  component: ComponentType<DetailRowData<T>>;
  path: keyof T;
};

type DetailAreaProps<T> = {
  data: T;
  fields: DetailField<T>[];
};

export default function DetailArea<T>({ data, fields }: DetailAreaProps<T>) {
  return (
    <React.Fragment>
      {fields.map(({ component: Component, path }, index) => {
        const getValue = () => data[path];

        const row: DetailRowData<T> = {
          data,
          row: {
            id: path,
          },
          getValue,
        };

        return (
          <div key={`detail-${index}`}>
            <Component {...row} />
          </div>
        );
      })}
    </React.Fragment>
  );
}
