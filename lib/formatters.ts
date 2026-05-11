export const formatters = {
  currency: (value: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(value);
  },

  number: (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  percent: (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  },

  date: (date: Date | string, formatStyle: "short" | "long" = "short") => {
    const options: Intl.DateTimeFormatOptions =
      formatStyle === "short"
        ? { day: "2-digit", month: "2-digit", year: "numeric" }
        : {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          };
    return new Intl.DateTimeFormat("vi-VN", options).format(new Date(date));
  },

  compactNumber: (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(value);
  },
};
