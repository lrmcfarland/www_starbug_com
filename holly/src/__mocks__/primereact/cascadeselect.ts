import React from "react";

export const CascadeSelect = ({ value, onChange, options }: any) =>
  React.createElement(
    "select",
    {
      value,
      onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
        onChange({ value: event.currentTarget.value }),
      "data-testid": "timezone-cascade-select",
    },
    options.flatMap((group: any) =>
      group.cities.map((city: any) =>
        React.createElement("option", { key: city.code, value: city.code }, city.city),
      ),
    ),
  );
