type labelValue = { label: string; value: string };
export const getLabelForValue = (
  options: labelValue[],
  value: string
): string => {
  return options.find(o => o.value === value)?.label ?? undefined;
};

export const getValueForLabel = (
  options: labelValue[],
  label: string
): string => {
  return options.find(o => o.label === label)?.value ?? undefined;
};
