import { RefObject } from "react";

export default function BaseReportPrint({
  data,
  ref,
}: {
  data: { name: string; containerItems: { item: { name: string } }[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: RefObject<any>;
}) {
  return (
    <>
      <style type="text/css" media="print">
        {`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
          font-family: Arial, sans-serif;
        font-size: 8pt;
        color: black;
        }
        .report-body {
          columns: 2;
          column-gap: 2px 10px; /* Vertical | Horizontal */
          page-break-inside: avoid;
          column-fill: auto;
          break-inside: avoid;
          max-height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          page-break-after: always;
        }
        .report-grid-item {
          display: grid;
          grid-template-columns: 15px 1fr 1fr;
          gap: 2px;
          padding: 0.1em;
          page-break-inside: avoid;
        }
          .report-grid-item:nth-of-type(even) {
          background-color: lightgray;
        }
        .headerClass {
          display: flex;
          width: 100%;
          box-sizing: border-box;
          height: auto;
          background-color: #4a4a4a;
          page-break-after: avoid;
          padding: 0.3em;
          color: whitesmoke;
          justify-content: space-between;
          align-items: center;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .container-name {
          font-size: 14pt !important;
          text-align: left;
          margin-left: 5px;
        }
        .created-at {
          text-align: right;
          margin-right: 5px;
        }

        @page {
          size: 8.5in 11in;
          margin: 7mm;
        }
      `}
      </style>
      <div ref={ref}>
        <div className="headerClass">
          <span className="container-name">{data?.name}</span>
          <span className="created-at">
            {new Date(performance.timeOrigin).toLocaleDateString("en", {
              weekday: "short",
              year: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              timeZoneName: "short",
            })}
          </span>
        </div>
        <div className="report-body">
          <div className="report-grid">
            {data?.containerItems?.map(({ item: { name } }, index) => (
              <div className="report-grid-item" key={`item-${name}`}>
                <div>
                  {(index === 0 ||
                    data.containerItems[index - 1]?.item.name.charAt(0) !==
                      name.charAt(0)) && (
                    <strong>{name.charAt(0).toUpperCase()}</strong>
                  )}
                </div>
                <div>{name}</div>
                <div>{data.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
