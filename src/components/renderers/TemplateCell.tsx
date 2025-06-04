"use client";

import React, { cloneElement, ReactElement, useState } from "react";

export default function TemplateCell({
  children,
}: {
  children: [
    ReactElement<{ toggleWriting: () => void }>,
    ReactElement<{ toggleReading: () => void }>
  ];
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [readComponent, writeComponent] = children;

  const ReadComponent = cloneElement(readComponent, {
    toggleWriting: () => setIsEditing(true),
  });
  const WriteComponent = cloneElement(writeComponent, {
    toggleReading: () => setIsEditing(false),
  });

  return (
    <React.Fragment>
      {isEditing ? <>{WriteComponent}</> : <>{ReadComponent}</>}
    </React.Fragment>
  );
}
