import type { TextField } from "payload";

export const colorPickerField = (
  overrides?: Omit<TextField, "type">,
): TextField => {
  const { name = "color", label = "Color", admin, ...rest } = overrides ?? {};

  return {
    type: "text",
    name,
    label,
    admin: {
      ...admin,
      components: {
        Field: "@/fields/colorPicker/ColorPickerComponent#ColorPickerComponent",
      },
    },
    ...rest,
  } as TextField;
};
