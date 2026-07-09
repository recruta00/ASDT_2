import type { Bike, Property } from "@/data/types";

/** Compact spec line for a bike card, e.g. ["125CC", "2024", "CASQUE INCLUS"]. */
export function bikeCardSpecs(bike: Bike): string[] {
  return [
    `${bike.engineCc}CC`,
    `${bike.year}`,
    bike.helmetIncluded ? "Casque inclus" : bike.transmission,
  ];
}

/** Full spec table for a bike detail page. */
export function bikeSpecTable(bike: Bike): Array<[string, string]> {
  return [
    ["Cylindrée", `${bike.engineCc} cm³`],
    ["Année", `${bike.year}`],
    ["Transmission", bike.transmission],
    ["Casque", bike.helmetIncluded ? "Inclus" : "Non inclus"],
    ["Caution", `${bike.deposit} MAD`],
    ["Kilométrage", bike.kmPolicy],
  ];
}

/** Compact spec line for a property card, e.g. ["2 CH", "2 SDB", "95 M²", "PISCINE"]. */
export function propertyCardSpecs(property: Property): string[] {
  const specs = [
    `${property.bedrooms} CH`,
    `${property.bathrooms} SDB`,
    `${property.areaM2} M²`,
  ];
  if (property.pool) specs.push("Piscine");
  return specs;
}

/** Full spec table for a property detail page. */
export function propertySpecTable(property: Property): Array<[string, string]> {
  return [
    ["Type", property.type === "villa" ? "Villa" : "Appartement"],
    ["Chambres", `${property.bedrooms}`],
    ["Salles de bain", `${property.bathrooms}`],
    ["Surface", `${property.areaM2} m²`],
    ["Nuits minimum", `${property.minNights}`],
    ["Arrivée / Départ", `${property.checkIn} / ${property.checkOut}`],
    ["Caution", `${property.deposit} MAD`],
  ];
}
